export type ToolCategory =
  | 'SEO Tools'
  | 'Modifiers'
  | 'Validators'
  | 'Keyword Research'
  | 'Website Analysis'
  | 'AI Content Writing'
  | 'AI Email & Sales'
  | 'Utility';

export type ToolDefinition = {
  id: string;
  slug: string;
  title: string;
  desc: string;
  icon: string;
  category: ToolCategory;
};

export const toolCategories: Array<'All Tools' | ToolCategory> = [
  'All Tools',
  'SEO Tools',
  'Modifiers',
  'Validators',
  'Keyword Research',
  'Website Analysis',
  'AI Content Writing',
  'AI Email & Sales',
  'Utility',
];

export const allTools: ToolDefinition[] = [
  { id: '1', slug: 'meta-tag-generator', title: 'Meta Tag Generator', desc: 'Generate SEO-friendly meta tags.', icon: 'code', category: 'SEO Tools' },
  { id: '2', slug: 'robots-txt-generator', title: 'Robots.txt Generator', desc: 'Create a robots.txt file easily.', icon: 'file-text', category: 'SEO Tools' },
  { id: '3', slug: 'xml-sitemap-generator', title: 'XML Sitemap Generator', desc: 'Generate XML sitemaps instantly.', icon: 'map', category: 'SEO Tools' },
  { id: '4', slug: 'backlink-checker', title: 'Backlink Checker', desc: 'Inspect external links found on a page.', icon: 'link', category: 'Website Analysis' },
  { id: '5', slug: 'domain-authority', title: 'Domain Authority', desc: 'Estimate authority from on-page SEO signals.', icon: 'bar-chart-2', category: 'Website Analysis' },
  { id: '6', slug: 'broken-link-checker', title: 'Broken Link Checker', desc: 'Find broken links on a page.', icon: 'link-2', category: 'Website Analysis' },
  { id: '7', slug: 'schema-markup', title: 'Schema Markup', desc: 'Validate JSON-LD schema data.', icon: 'check-square', category: 'Validators' },
  { id: '8', slug: 'plagiarism-checker', title: 'Plagiarism Checker', desc: 'Check repeated sentences and phrases.', icon: 'file-minus', category: 'Validators' },
  { id: '9', slug: 'keyword-density', title: 'Keyword Density', desc: 'Analyze keyword frequency.', icon: 'percent', category: 'Keyword Research' },
  { id: '10', slug: 'website-analysis', title: 'Website Analysis', desc: 'Get a comprehensive SEO report.', icon: 'activity', category: 'Website Analysis' },
  { id: '11', slug: 'ai-blog-generator', title: 'AI Blog Generator', desc: 'Generate a structured blog draft.', icon: 'edit', category: 'AI Content Writing' },
  { id: '12', slug: 'ai-article-rewriter', title: 'AI Article Rewriter', desc: 'Rewrite existing articles with a new tone.', icon: 'refresh-cw', category: 'AI Content Writing' },
  { id: '13', slug: 'css-minifier', title: 'CSS Minifier', desc: 'Compress CSS code to load faster.', icon: 'minimize', category: 'Modifiers' },
  { id: '14', slug: 'js-minifier', title: 'JS Minifier', desc: 'Minify JavaScript snippets.', icon: 'cpu', category: 'Modifiers' },
  { id: '15', slug: 'word-counter', title: 'Word Counter', desc: 'Count words and characters.', icon: 'type', category: 'Utility' },
  { id: '16', slug: 'image-compressor', title: 'Image Compressor', desc: 'Plan a lighter image asset for the web.', icon: 'image', category: 'Utility' },
  { id: '17', slug: 'what-is-my-ip', title: 'What Is My IP', desc: 'Check your public IP address.', icon: 'globe', category: 'Utility' },
  { id: '18', slug: 'server-status', title: 'Server Status', desc: 'Check if a website is responding.', icon: 'server', category: 'Website Analysis' },
  { id: '19', slug: 'favicon-generator', title: 'Favicon Generator', desc: 'Create a simple SVG favicon kit.', icon: 'star', category: 'Utility' },
  { id: '20', slug: 'utm-builder', title: 'UTM Builder', desc: 'Build tracking URLs for campaigns.', icon: 'target', category: 'Utility' },
  { id: '21', slug: 'json-formatter', title: 'JSON Formatter', desc: 'Format and validate JSON data.', icon: 'code', category: 'Validators' },
  { id: '22', slug: 'md5-generator', title: 'MD5 Generator', desc: 'Generate an MD5 hash for text.', icon: 'lock', category: 'Utility' },
];

export const toolsBySlug = Object.fromEntries(
  allTools.map((tool) => [tool.slug, tool])
) as Record<string, ToolDefinition>;
