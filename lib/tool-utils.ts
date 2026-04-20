type LinkCheckResult = {
  url: string;
  ok: boolean;
  status: string;
};

export type WebsiteReport = {
  finalUrl: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  robots: string;
  wordCount: number;
  imageCount: number;
  internalLinks: number;
  externalLinks: number;
  missing: string[];
};

export type BacklinkReport = {
  finalUrl: string;
  totalExternalLinks: number;
  uniqueDomains: number;
  links: string[];
};

export type ServerStatusReport = {
  url: string;
  statusCode: number;
  ok: boolean;
  responseTimeMs: number;
};

export type DomainAuthorityReport = {
  score: number;
  grade: string;
  reasons: string[];
  report: WebsiteReport;
};

export type BrokenLinkReport = {
  checked: number;
  broken: LinkCheckResult[];
  healthy: LinkCheckResult[];
};

export type KeywordDensityRow = {
  keyword: string;
  count: number;
  density: string;
};

export type KeywordDensityReport = {
  totalWords: number;
  focusKeywordCount: number;
  focusKeywordDensity: string;
  topKeywords: KeywordDensityRow[];
};

export type PlagiarismReport = {
  sentenceCount: number;
  duplicateSentenceCount: number;
  duplicateRate: string;
  repeatedPhrases: string[];
};

export type ImageCompressionPlan = {
  optimizedWidth: number;
  optimizedHeight: number;
  originalSizeKb: number;
  estimatedSizeKb: number;
  estimatedSavingsKb: number;
  estimatedSavingsPercent: number;
  markup: string;
};

export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('Please enter a valid URL.');
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function fetchHtml(targetUrl: string) {
  const response = await fetch(normalizeUrl(targetUrl));
  if (!response.ok) {
    throw new Error(`Unable to fetch page (${response.status}).`);
  }

  return {
    finalUrl: response.url,
    html: await response.text(),
  };
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function getMatch(html: string, expression: RegExp) {
  const match = html.match(expression);
  return match?.[1] ? decodeHtmlEntities(match[1]) : '';
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
}

function toWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1);
}

function extractLinks(html: string, baseUrl: string) {
  const matches = [...html.matchAll(/<a[^>]+href=["']([^"'#]+)[^"']*["']/gi)];
  const uniqueLinks = new Set<string>();

  matches.forEach((match) => {
    const href = match[1]?.trim();
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    try {
      uniqueLinks.add(new URL(href, baseUrl).toString());
    } catch {
      // Ignore malformed URLs.
    }
  });

  return [...uniqueLinks];
}

function splitLinks(links: string[], baseUrl: string) {
  const baseHost = new URL(baseUrl).host;
  const internal: string[] = [];
  const external: string[] = [];

  links.forEach((link) => {
    try {
      const host = new URL(link).host;
      if (host === baseHost) {
        internal.push(link);
      } else {
        external.push(link);
      }
    } catch {
      // Ignore malformed URLs.
    }
  });

  return { internal, external };
}

function getTextMetrics(html: string) {
  const words = toWords(stripHtml(html));
  return {
    words,
    wordCount: words.length,
  };
}

export async function analyzeWebsite(targetUrl: string): Promise<WebsiteReport> {
  const { finalUrl, html } = await fetchHtml(targetUrl);
  const links = extractLinks(html, finalUrl);
  const { internal, external } = splitLinks(links, finalUrl);

  const title = getMatch(html, /<title>([\s\S]*?)<\/title>/i);
  const description = getMatch(html, /<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i);
  const canonical = getMatch(html, /<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["'][^>]*>/i);
  const h1 = getMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/\s+/g, ' ');
  const robots = getMatch(html, /<meta[^>]*name=["']robots["'][^>]*content=["'](.*?)["'][^>]*>/i);
  const imageCount = [...html.matchAll(/<img\b/gi)].length;
  const { wordCount } = getTextMetrics(html);
  const missing = [
    !title && 'Missing title tag',
    !description && 'Missing meta description',
    !canonical && 'Missing canonical tag',
    !h1 && 'Missing H1 heading',
    !robots && 'Missing robots meta',
  ].filter(Boolean) as string[];

  return {
    finalUrl,
    title: title || 'Not found',
    description: description || 'Not found',
    canonical: canonical || 'Not found',
    h1: h1 || 'Not found',
    robots: robots || 'Not found',
    wordCount,
    imageCount,
    internalLinks: internal.length,
    externalLinks: external.length,
    missing,
  };
}

export async function inspectBacklinks(targetUrl: string): Promise<BacklinkReport> {
  const { finalUrl, html } = await fetchHtml(targetUrl);
  const links = extractLinks(html, finalUrl);
  const { external } = splitLinks(links, finalUrl);
  const domains = new Set(
    external.map((link) => {
      try {
        return new URL(link).host;
      } catch {
        return '';
      }
    }).filter(Boolean)
  );

  return {
    finalUrl,
    totalExternalLinks: external.length,
    uniqueDomains: domains.size,
    links: external.slice(0, 25),
  };
}

export async function checkServerStatus(targetUrl: string): Promise<ServerStatusReport> {
  const normalizedUrl = normalizeUrl(targetUrl);
  const start = Date.now();
  const response = await fetch(normalizedUrl);
  const responseTimeMs = Date.now() - start;

  return {
    url: response.url,
    statusCode: response.status,
    ok: response.ok,
    responseTimeMs,
  };
}

export async function estimateDomainAuthority(targetUrl: string): Promise<DomainAuthorityReport> {
  const report = await analyzeWebsite(targetUrl);
  let score = 35;
  const reasons: string[] = [];

  if (report.title !== 'Not found') {
    score += 10;
    reasons.push('Title tag is present.');
  } else {
    reasons.push('Title tag is missing.');
  }

  if (report.description !== 'Not found') {
    score += 10;
    reasons.push('Meta description is present.');
  } else {
    reasons.push('Meta description is missing.');
  }

  if (report.canonical !== 'Not found') {
    score += 10;
    reasons.push('Canonical tag is configured.');
  }

  if (report.h1 !== 'Not found') {
    score += 8;
    reasons.push('Primary H1 heading exists.');
  }

  if (report.wordCount >= 300) {
    score += 8;
    reasons.push('Page has enough body content.');
  } else {
    reasons.push('Body content is thin.');
  }

  if (report.internalLinks >= 5) {
    score += 6;
    reasons.push('Internal linking is healthy.');
  }

  if (report.imageCount > 0) {
    score += 4;
    reasons.push('Page contains supporting media.');
  }

  if (report.finalUrl.startsWith('https://')) {
    score += 4;
    reasons.push('HTTPS is enabled.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    grade: score >= 85 ? 'Excellent' : score >= 70 ? 'Strong' : score >= 55 ? 'Average' : 'Needs Work',
    reasons,
    report,
  };
}

export async function checkBrokenLinks(targetUrl: string): Promise<BrokenLinkReport> {
  const { finalUrl, html } = await fetchHtml(targetUrl);
  const allLinks = extractLinks(html, finalUrl);
  const { internal } = splitLinks(allLinks, finalUrl);
  const linksToCheck = internal.slice(0, 12);

  const results = await Promise.all(
    linksToCheck.map(async (link) => {
      try {
        const response = await fetch(link);
        return {
          url: link,
          ok: response.ok,
          status: `${response.status}`,
        };
      } catch {
        return {
          url: link,
          ok: false,
          status: 'Network error',
        };
      }
    })
  );

  return {
    checked: results.length,
    broken: results.filter((item) => !item.ok),
    healthy: results.filter((item) => item.ok),
  };
}

export function validateSchemaMarkup(input: string) {
  const parsed = JSON.parse(input);
  const issues: string[] = [];

  if (!parsed['@context']) {
    issues.push('Missing @context.');
  }
  if (!parsed['@type']) {
    issues.push('Missing @type.');
  }

  return {
    valid: issues.length === 0,
    issues,
    formatted: JSON.stringify(parsed, null, 2),
  };
}

export function buildKeywordDensity(text: string, focusKeyword: string): KeywordDensityReport {
  const words = toWords(text);
  const totalWords = words.length;
  const keywordMap = new Map<string, number>();

  words.forEach((word) => {
    keywordMap.set(word, (keywordMap.get(word) ?? 0) + 1);
  });

  const topKeywords = [...keywordMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: totalWords ? `${((count / totalWords) * 100).toFixed(2)}%` : '0.00%',
    }));

  const normalizedFocus = focusKeyword.trim().toLowerCase();
  const focusKeywordCount = normalizedFocus
    ? text.toLowerCase().split(normalizedFocus).length - 1
    : 0;

  return {
    totalWords,
    focusKeywordCount,
    focusKeywordDensity: totalWords && normalizedFocus
      ? `${((focusKeywordCount / totalWords) * 100).toFixed(2)}%`
      : '0.00%',
    topKeywords,
  };
}

export function checkPlagiarism(text: string): PlagiarismReport {
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim().toLowerCase())
    .filter(Boolean);

  const sentenceMap = new Map<string, number>();
  sentences.forEach((sentence) => {
    sentenceMap.set(sentence, (sentenceMap.get(sentence) ?? 0) + 1);
  });

  const duplicateSentenceCount = [...sentenceMap.values()].filter((count) => count > 1).length;
  const words = toWords(text);
  const phraseMap = new Map<string, number>();

  for (let index = 0; index < words.length - 2; index += 1) {
    const phrase = words.slice(index, index + 3).join(' ');
    phraseMap.set(phrase, (phraseMap.get(phrase) ?? 0) + 1);
  }

  const repeatedPhrases = [...phraseMap.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([phrase]) => phrase);

  return {
    sentenceCount: sentences.length,
    duplicateSentenceCount,
    duplicateRate: sentences.length ? `${((duplicateSentenceCount / sentences.length) * 100).toFixed(2)}%` : '0.00%',
    repeatedPhrases,
  };
}

export function generateMetaTags(input: {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  image: string;
  type: string;
}) {
  return [
    `<title>${input.title}</title>`,
    `<meta name="description" content="${input.description}" />`,
    `<meta name="keywords" content="${input.keywords}" />`,
    `<meta name="author" content="${input.author}" />`,
    `<link rel="canonical" href="${input.canonical}" />`,
    `<meta property="og:title" content="${input.title}" />`,
    `<meta property="og:description" content="${input.description}" />`,
    `<meta property="og:type" content="${input.type}" />`,
    `<meta property="og:url" content="${input.canonical}" />`,
    `<meta property="og:image" content="${input.image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${input.title}" />`,
    `<meta name="twitter:description" content="${input.description}" />`,
    `<meta name="twitter:image" content="${input.image}" />`,
  ].join('\n');
}

export function generateRobotsTxt(input: {
  domain: string;
  disallow: string;
  allow: string;
  crawlDelay: string;
  sitemap: string;
}) {
  const allows = input.allow.split('\n').map((line) => line.trim()).filter(Boolean);
  const disallows = input.disallow.split('\n').map((line) => line.trim()).filter(Boolean);
  const lines = ['User-agent: *'];

  allows.forEach((line) => lines.push(`Allow: ${line}`));
  disallows.forEach((line) => lines.push(`Disallow: ${line}`));

  if (input.crawlDelay.trim()) {
    lines.push(`Crawl-delay: ${input.crawlDelay.trim()}`);
  }

  lines.push(`Sitemap: ${input.sitemap.trim() || `${normalizeUrl(input.domain)}/sitemap.xml`}`);
  return lines.join('\n');
}

export function generateSitemapXml(input: {
  domain: string;
  paths: string;
  changefreq: string;
  priority: string;
}) {
  const baseUrl = normalizeUrl(input.domain).replace(/\/$/, '');
  const paths = input.paths
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const urls = (paths.length ? paths : ['/']).map((path) => {
    const location = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    return [
      '  <url>',
      `    <loc>${location}</loc>`,
      `    <changefreq>${input.changefreq}</changefreq>`,
      `    <priority>${input.priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');
}

function replaceCommonPhrases(text: string, tone: string) {
  const replacements: Record<string, string> = {
    important: tone === 'Formal' ? 'essential' : 'really important',
    help: tone === 'Formal' ? 'assist' : 'help out',
    improve: tone === 'Formal' ? 'enhance' : 'boost',
    use: tone === 'Formal' ? 'utilize' : 'use',
    show: tone === 'Formal' ? 'demonstrate' : 'show',
  };

  return Object.entries(replacements).reduce(
    (updated, [from, to]) => updated.replace(new RegExp(`\\b${from}\\b`, 'gi'), to),
    text
  );
}

export function generateBlogDraft(input: {
  topic: string;
  audience: string;
  tone: string;
  keywords: string;
}) {
  const keywordList = input.keywords.split(',').map((value) => value.trim()).filter(Boolean);
  const primaryKeyword = keywordList[0] || input.topic;

  return [
    `# ${input.topic}`,
    '',
    `## Introduction`,
    `${input.topic} matters because ${input.audience.toLowerCase()} need practical ways to improve results without wasting time. This ${input.tone.toLowerCase()} guide explains where to start and how to stay consistent.`,
    '',
    `## Why ${primaryKeyword} Matters`,
    `${primaryKeyword} supports visibility, trust, and conversions. When the basics are handled well, teams can scale their content and performance with fewer mistakes.`,
    '',
    `## Action Plan`,
    `1. Audit the current situation and identify quick wins.`,
    `2. Build a repeatable workflow around ${keywordList.slice(0, 3).join(', ') || input.topic}.`,
    `3. Measure impact weekly and improve weak pages first.`,
    '',
    `## Common Mistakes`,
    `Avoid publishing thin content, skipping metadata, and ignoring search intent. These issues reduce the value of even strong topics.`,
    '',
    `## Conclusion`,
    `A focused process helps ${input.audience.toLowerCase()} turn ${input.topic.toLowerCase()} into measurable growth.`,
  ].join('\n');
}

export function rewriteArticle(text: string, tone: string) {
  const cleaned = text.trim();
  const intro = tone === 'Formal'
    ? 'Here is a refined version with clearer structure and tone:'
    : tone === 'Persuasive'
      ? 'Here is a stronger and more persuasive rewrite:'
      : 'Here is a cleaner rewritten version:';

  const rewritten = replaceCommonPhrases(cleaned, tone)
    .replace(/\s+/g, ' ')
    .replace(/\. /g, '.\n\n');

  return `${intro}\n\n${rewritten}`;
}

export function minifyCss(input: string) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

export function minifyJs(input: string) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:+\-*/=<>])\s*/g, '$1')
    .trim();
}

export function countWords(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text ? text.split('\n').length : 0;
  const paragraphs = text.split(/\n\s*\n/).filter((block) => block.trim()).length;
  const readingMinutes = words.length ? Math.max(1, Math.ceil(words.length / 200)) : 0;

  return {
    words: words.length,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    readingMinutes,
  };
}

export function createImageCompressionPlan(input: {
  imageUrl: string;
  originalSizeKb: string;
  width: string;
  height: string;
  quality: string;
}) {
  const originalSizeKb = Number(input.originalSizeKb) || 0;
  const width = Number(input.width) || 1200;
  const height = Number(input.height) || 630;
  const quality = Math.min(100, Math.max(10, Number(input.quality) || 70));
  const estimatedSizeKb = Math.max(10, Math.round(originalSizeKb * (quality / 100) * 0.72));
  const optimizedWidth = Math.round(width * 0.8);
  const optimizedHeight = Math.round(height * 0.8);

  return {
    optimizedWidth,
    optimizedHeight,
    originalSizeKb,
    estimatedSizeKb,
    estimatedSavingsKb: Math.max(0, originalSizeKb - estimatedSizeKb),
    estimatedSavingsPercent: originalSizeKb ? Math.max(0, Math.round(((originalSizeKb - estimatedSizeKb) / originalSizeKb) * 100)) : 0,
    markup: `<img src="${input.imageUrl}" width="${optimizedWidth}" height="${optimizedHeight}" loading="lazy" decoding="async" alt="" />`,
  } satisfies ImageCompressionPlan;
}

export async function getPublicIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  if (!response.ok) {
    throw new Error('Unable to fetch public IP.');
  }

  const data = await response.json() as { ip: string };
  return data.ip;
}

export function generateFaviconKit(input: {
  brandName: string;
  backgroundColor: string;
  textColor: string;
}) {
  const initials = input.brandName
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'OS';

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">`,
    `<rect width="64" height="64" rx="16" fill="${input.backgroundColor}" />`,
    `<text x="32" y="39" text-anchor="middle" font-size="26" font-family="Arial, sans-serif" fill="${input.textColor}" font-weight="700">${initials}</text>`,
    `</svg>`,
  ].join('');

  const encodedSvg = encodeURIComponent(svg);
  const html = [
    `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodedSvg}" />`,
    `<link rel="shortcut icon" href="data:image/svg+xml,${encodedSvg}" />`,
  ].join('\n');

  return { initials, svg, html };
}

export function buildUtmUrl(input: {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}) {
  const url = new URL(normalizeUrl(input.url));
  if (input.source.trim()) url.searchParams.set('utm_source', input.source.trim());
  if (input.medium.trim()) url.searchParams.set('utm_medium', input.medium.trim());
  if (input.campaign.trim()) url.searchParams.set('utm_campaign', input.campaign.trim());
  if (input.term.trim()) url.searchParams.set('utm_term', input.term.trim());
  if (input.content.trim()) url.searchParams.set('utm_content', input.content.trim());
  return url.toString();
}

export function formatJson(input: string) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, 2);
}

function rotateLeft(value: number, shift: number) {
  return (value << shift) | (value >>> (32 - shift));
}

function addUnsigned(a: number, b: number) {
  const lX8 = a & 0x80000000;
  const lY8 = b & 0x80000000;
  const lX4 = a & 0x40000000;
  const lY4 = b & 0x40000000;
  const result = (a & 0x3fffffff) + (b & 0x3fffffff);

  if (lX4 & lY4) {
    return result ^ 0x80000000 ^ lX8 ^ lY8;
  }
  if (lX4 | lY4) {
    return result & 0x40000000
      ? result ^ 0xc0000000 ^ lX8 ^ lY8
      : result ^ 0x40000000 ^ lX8 ^ lY8;
  }

  return result ^ lX8 ^ lY8;
}

function f(x: number, y: number, z: number) {
  return (x & y) | (~x & z);
}

function g(x: number, y: number, z: number) {
  return (x & z) | (y & ~z);
}

function h(x: number, y: number, z: number) {
  return x ^ y ^ z;
}

function i(x: number, y: number, z: number) {
  return y ^ (x | ~z);
}

function convertToWordArray(text: string) {
  const wordArray: number[] = [];
  const messageLength = text.length;
  let byteCount = 0;

  while (byteCount < messageLength) {
    const wordCount = (byteCount - (byteCount % 4)) / 4;
    const bytePosition = (byteCount % 4) * 8;
    wordArray[wordCount] = wordArray[wordCount] | (text.charCodeAt(byteCount) << bytePosition);
    byteCount += 1;
  }

  const wordCount = (byteCount - (byteCount % 4)) / 4;
  const bytePosition = (byteCount % 4) * 8;
  wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition);
  wordArray[(((byteCount + 8) - ((byteCount + 8) % 64)) / 64 * 16) + 14] = messageLength * 8;
  return wordArray;
}

function wordToHex(value: number) {
  let output = '';
  for (let count = 0; count <= 3; count += 1) {
    const byte = (value >>> (count * 8)) & 255;
    output += `0${byte.toString(16)}`.slice(-2);
  }
  return output;
}

function transform(func: (x: number, y: number, z: number) => number, a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, func(b, c, d)), addUnsigned(x, ac)), s), b);
}

export function md5(input: string) {
  const x = convertToWordArray(unescape(encodeURIComponent(input)));
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let index = 0; index < x.length; index += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;

    a = transform(f, a, b, c, d, x[index + 0], 7, 0xd76aa478);
    d = transform(f, d, a, b, c, x[index + 1], 12, 0xe8c7b756);
    c = transform(f, c, d, a, b, x[index + 2], 17, 0x242070db);
    b = transform(f, b, c, d, a, x[index + 3], 22, 0xc1bdceee);
    a = transform(f, a, b, c, d, x[index + 4], 7, 0xf57c0faf);
    d = transform(f, d, a, b, c, x[index + 5], 12, 0x4787c62a);
    c = transform(f, c, d, a, b, x[index + 6], 17, 0xa8304613);
    b = transform(f, b, c, d, a, x[index + 7], 22, 0xfd469501);
    a = transform(f, a, b, c, d, x[index + 8], 7, 0x698098d8);
    d = transform(f, d, a, b, c, x[index + 9], 12, 0x8b44f7af);
    c = transform(f, c, d, a, b, x[index + 10], 17, 0xffff5bb1);
    b = transform(f, b, c, d, a, x[index + 11], 22, 0x895cd7be);
    a = transform(f, a, b, c, d, x[index + 12], 7, 0x6b901122);
    d = transform(f, d, a, b, c, x[index + 13], 12, 0xfd987193);
    c = transform(f, c, d, a, b, x[index + 14], 17, 0xa679438e);
    b = transform(f, b, c, d, a, x[index + 15], 22, 0x49b40821);

    a = transform(g, a, b, c, d, x[index + 1], 5, 0xf61e2562);
    d = transform(g, d, a, b, c, x[index + 6], 9, 0xc040b340);
    c = transform(g, c, d, a, b, x[index + 11], 14, 0x265e5a51);
    b = transform(g, b, c, d, a, x[index + 0], 20, 0xe9b6c7aa);
    a = transform(g, a, b, c, d, x[index + 5], 5, 0xd62f105d);
    d = transform(g, d, a, b, c, x[index + 10], 9, 0x02441453);
    c = transform(g, c, d, a, b, x[index + 15], 14, 0xd8a1e681);
    b = transform(g, b, c, d, a, x[index + 4], 20, 0xe7d3fbc8);
    a = transform(g, a, b, c, d, x[index + 9], 5, 0x21e1cde6);
    d = transform(g, d, a, b, c, x[index + 14], 9, 0xc33707d6);
    c = transform(g, c, d, a, b, x[index + 3], 14, 0xf4d50d87);
    b = transform(g, b, c, d, a, x[index + 8], 20, 0x455a14ed);
    a = transform(g, a, b, c, d, x[index + 13], 5, 0xa9e3e905);
    d = transform(g, d, a, b, c, x[index + 2], 9, 0xfcefa3f8);
    c = transform(g, c, d, a, b, x[index + 7], 14, 0x676f02d9);
    b = transform(g, b, c, d, a, x[index + 12], 20, 0x8d2a4c8a);

    a = transform(h, a, b, c, d, x[index + 5], 4, 0xfffa3942);
    d = transform(h, d, a, b, c, x[index + 8], 11, 0x8771f681);
    c = transform(h, c, d, a, b, x[index + 11], 16, 0x6d9d6122);
    b = transform(h, b, c, d, a, x[index + 14], 23, 0xfde5380c);
    a = transform(h, a, b, c, d, x[index + 1], 4, 0xa4beea44);
    d = transform(h, d, a, b, c, x[index + 4], 11, 0x4bdecfa9);
    c = transform(h, c, d, a, b, x[index + 7], 16, 0xf6bb4b60);
    b = transform(h, b, c, d, a, x[index + 10], 23, 0xbebfbc70);
    a = transform(h, a, b, c, d, x[index + 13], 4, 0x289b7ec6);
    d = transform(h, d, a, b, c, x[index + 0], 11, 0xeaa127fa);
    c = transform(h, c, d, a, b, x[index + 3], 16, 0xd4ef3085);
    b = transform(h, b, c, d, a, x[index + 6], 23, 0x04881d05);
    a = transform(h, a, b, c, d, x[index + 9], 4, 0xd9d4d039);
    d = transform(h, d, a, b, c, x[index + 12], 11, 0xe6db99e5);
    c = transform(h, c, d, a, b, x[index + 15], 16, 0x1fa27cf8);
    b = transform(h, b, c, d, a, x[index + 2], 23, 0xc4ac5665);

    a = transform(i, a, b, c, d, x[index + 0], 6, 0xf4292244);
    d = transform(i, d, a, b, c, x[index + 7], 10, 0x432aff97);
    c = transform(i, c, d, a, b, x[index + 14], 15, 0xab9423a7);
    b = transform(i, b, c, d, a, x[index + 5], 21, 0xfc93a039);
    a = transform(i, a, b, c, d, x[index + 12], 6, 0x655b59c3);
    d = transform(i, d, a, b, c, x[index + 3], 10, 0x8f0ccc92);
    c = transform(i, c, d, a, b, x[index + 10], 15, 0xffeff47d);
    b = transform(i, b, c, d, a, x[index + 1], 21, 0x85845dd1);
    a = transform(i, a, b, c, d, x[index + 8], 6, 0x6fa87e4f);
    d = transform(i, d, a, b, c, x[index + 15], 10, 0xfe2ce6e0);
    c = transform(i, c, d, a, b, x[index + 6], 15, 0xa3014314);
    b = transform(i, b, c, d, a, x[index + 13], 21, 0x4e0811a1);
    a = transform(i, a, b, c, d, x[index + 4], 6, 0xf7537e82);
    d = transform(i, d, a, b, c, x[index + 11], 10, 0xbd3af235);
    c = transform(i, c, d, a, b, x[index + 2], 15, 0x2ad7d2bb);
    b = transform(i, b, c, d, a, x[index + 9], 21, 0xeb86d391);

    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  return `${wordToHex(a)}${wordToHex(b)}${wordToHex(c)}${wordToHex(d)}`.toLowerCase();
}
