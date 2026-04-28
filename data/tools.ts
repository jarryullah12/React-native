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
  { id: '23', slug: 'title-tag-preview', title: 'Title Tag Preview', desc: 'Preview how your title looks in SERP snippets.', icon: 'type', category: 'SEO Tools' },
  { id: '24', slug: 'meta-description-checker', title: 'Meta Description Checker', desc: 'Check meta description length and readability.', icon: 'file-text', category: 'SEO Tools' },
  { id: '25', slug: 'open-graph-generator', title: 'Open Graph Generator', desc: 'Generate Open Graph tags for social sharing.', icon: 'share-2', category: 'SEO Tools' },
  { id: '26', slug: 'twitter-card-generator', title: 'Twitter Card Generator', desc: 'Create Twitter Card meta tags quickly.', icon: 'message-circle', category: 'SEO Tools' },
  { id: '27', slug: 'canonical-url-checker', title: 'Canonical URL Checker', desc: 'Validate canonical tags and preferred URLs.', icon: 'link', category: 'SEO Tools' },
  { id: '28', slug: 'hreflang-generator', title: 'Hreflang Generator', desc: 'Generate hreflang tags for multilingual pages.', icon: 'globe', category: 'SEO Tools' },
  { id: '29', slug: 'hreflang-validator', title: 'Hreflang Validator', desc: 'Validate hreflang implementation and language codes.', icon: 'check-circle', category: 'SEO Tools' },
  { id: '30', slug: 'redirect-checker', title: 'Redirect Checker', desc: 'Inspect redirect chains and status responses.', icon: 'repeat', category: 'SEO Tools' },
  { id: '31', slug: 'http-header-checker', title: 'HTTP Header Checker', desc: 'Analyze HTTP response headers for SEO signals.', icon: 'list', category: 'SEO Tools' },
  { id: '32', slug: 'meta-robots-checker', title: 'Meta Robots Checker', desc: 'Check index and follow directives on a page.', icon: 'shield', category: 'SEO Tools' },
  { id: '33', slug: 'x-robots-tag-checker', title: 'X-Robots-Tag Checker', desc: 'Review X-Robots-Tag directives from server headers.', icon: 'shield-off', category: 'SEO Tools' },
  { id: '34', slug: 'sitemap-validator', title: 'Sitemap Validator', desc: 'Validate sitemap XML structure and URL entries.', icon: 'check-square', category: 'SEO Tools' },
  { id: '35', slug: 'sitemap-url-extractor', title: 'Sitemap URL Extractor', desc: 'Extract and list URLs from sitemap files.', icon: 'map-pin', category: 'SEO Tools' },
  { id: '36', slug: 'robots-tester', title: 'Robots Tester', desc: 'Test whether URLs are blocked by robots rules.', icon: 'slash', category: 'SEO Tools' },
  { id: '37', slug: 'serp-snippet-optimizer', title: 'SERP Snippet Optimizer', desc: 'Optimize title and description for search snippets.', icon: 'search', category: 'SEO Tools' },
  { id: '38', slug: 'keyword-suggestion-generator', title: 'Keyword Suggestion Generator', desc: 'Generate related keyword ideas for content planning.', icon: 'compass', category: 'SEO Tools' },
  { id: '39', slug: 'long-tail-keyword-finder', title: 'Long-Tail Keyword Finder', desc: 'Discover long-tail keyword opportunities.', icon: 'trending-up', category: 'SEO Tools' },
  { id: '40', slug: 'keyword-difficulty-estimator', title: 'Keyword Difficulty Estimator', desc: 'Estimate ranking difficulty for target keywords.', icon: 'bar-chart-2', category: 'SEO Tools' },
  { id: '41', slug: 'search-intent-classifier', title: 'Search Intent Classifier', desc: 'Classify keywords by informational and transactional intent.', icon: 'target', category: 'SEO Tools' },
  { id: '42', slug: 'faq-schema-generator', title: 'FAQ Schema Generator', desc: 'Generate FAQ structured data markup.', icon: 'help-circle', category: 'SEO Tools' },
  { id: '43', slug: 'product-schema-generator', title: 'Product Schema Generator', desc: 'Create schema markup for product pages.', icon: 'shopping-bag', category: 'SEO Tools' },
  { id: '44', slug: 'article-schema-generator', title: 'Article Schema Generator', desc: 'Generate Article schema for blog posts.', icon: 'file-plus', category: 'SEO Tools' },
  { id: '45', slug: 'local-business-schema-generator', title: 'Local Business Schema Generator', desc: 'Create LocalBusiness schema for local SEO.', icon: 'home', category: 'SEO Tools' },
  { id: '46', slug: 'breadcrumb-schema-generator', title: 'Breadcrumb Schema Generator', desc: 'Generate breadcrumb structured data.', icon: 'chevrons-right', category: 'SEO Tools' },
  { id: '47', slug: 'internal-link-suggestor', title: 'Internal Link Suggestor', desc: 'Get contextual internal linking ideas.', icon: 'git-merge', category: 'SEO Tools' },
  { id: '48', slug: 'anchor-text-analyzer', title: 'Anchor Text Analyzer', desc: 'Analyze anchor text diversity and relevance.', icon: 'link-2', category: 'SEO Tools' },
  { id: '49', slug: 'page-speed-hint-checker', title: 'Page Speed Hint Checker', desc: 'Review optimization hints for faster loading pages.', icon: 'zap', category: 'SEO Tools' },
  { id: '50', slug: 'core-web-vitals-estimator', title: 'Core Web Vitals Estimator', desc: 'Estimate LCP, CLS, and INP readiness factors.', icon: 'activity', category: 'SEO Tools' },
  { id: '51', slug: 'mobile-friendly-checklist', title: 'Mobile Friendly Checklist', desc: 'Audit mobile usability best-practice checks.', icon: 'smartphone', category: 'SEO Tools' },
  { id: '52', slug: 'ssl-https-checker', title: 'SSL & HTTPS Checker', desc: 'Verify HTTPS presence and SSL security basics.', icon: 'lock', category: 'SEO Tools' },
  { id: '53', slug: 'seo-title-idea-generator', title: 'SEO Title Idea Generator', desc: 'Generate title tag ideas with character length guidance.', icon: 'edit-3', category: 'SEO Tools' },
  { id: '54', slug: 'meta-description-idea-generator', title: 'Meta Description Idea Generator', desc: 'Create CTR-focused meta description options.', icon: 'file-text', category: 'SEO Tools' },
  { id: '55', slug: 'seo-slug-generator', title: 'SEO Slug Generator', desc: 'Generate clean URL slugs from page titles.', icon: 'hash', category: 'SEO Tools' },
  { id: '56', slug: 'keyword-clusterer', title: 'Keyword Clusterer', desc: 'Group related keywords into topical clusters.', icon: 'layers', category: 'SEO Tools' },
  { id: '57', slug: 'keyword-intent-breakdown', title: 'Keyword Intent Breakdown', desc: 'Classify keywords by search intent.', icon: 'pie-chart', category: 'SEO Tools' },
  { id: '58', slug: 'semantic-keyword-expander', title: 'Semantic Keyword Expander', desc: 'Expand seed keywords with modifiers and locations.', icon: 'git-branch', category: 'SEO Tools' },
  { id: '59', slug: 'seo-content-outline-generator', title: 'SEO Content Outline Generator', desc: 'Generate a structured SEO-friendly content outline.', icon: 'list', category: 'SEO Tools' },
  { id: '60', slug: 'image-alt-text-helper', title: 'Image Alt Text Helper', desc: 'Draft concise and descriptive image alt text ideas.', icon: 'image', category: 'SEO Tools' },
  { id: '61', slug: 'internal-link-opportunities', title: 'Internal Link Opportunities', desc: 'Suggest internal linking opportunities from page inventory.', icon: 'link-2', category: 'SEO Tools' },
  { id: '62', slug: 'on-page-seo-checklist', title: 'On-Page SEO Checklist', desc: 'Generate a practical on-page optimization checklist.', icon: 'check-square', category: 'SEO Tools' },
];

export const toolsBySlug = Object.fromEntries(
  allTools.map((tool) => [tool.slug, tool])
) as Record<string, ToolDefinition>;
