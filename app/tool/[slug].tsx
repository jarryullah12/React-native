import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Image as ExpoImage } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { toolsBySlug } from '@/data/tools';
import {
    analyzeWebsite,
    buildKeywordIntentBreakdown,
    buildKeywordDensity,
    buildUtmUrl,
    checkBrokenLinks,
    checkPlagiarism,
    checkServerStatus,
    clusterKeywords,
    countWords,
    estimateDomainAuthority,
    expandSemanticKeywords,
    findInternalLinkOpportunities,
    formatJson,
    generateAltTextSuggestions,
    generateBlogDraft,
    generateMetaDescriptionIdeas,
    generateMetaTags,
    generateOnPageSeoChecklist,
    generateRobotsTxt,
    generateSeoContentOutline,
    generateSeoSlug,
    generateSeoTitleIdeas,
    generateSitemapXml,
    getPublicIp,
    inspectBacklinks,
    md5,
    minifyCss,
    minifyJs,
    normalizeUrl,
    rewriteArticle,
    validateSchemaMarkup,
} from '@/lib/tool-utils';

type FieldConfig = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'url';
};

type UploadedImage = {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
  fileName?: string | null;
  mimeType?: string | null;
};

type PreviewImage = {
  label: string;
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  mimeType?: string;
};

type DownloadAsset = {
  label: string;
  uri: string;
  fileName: string;
  mimeType: string;
};

function getInitialForm(slug: string) {
  const forms: Record<string, Record<string, string>> = {
    'meta-tag-generator': {
      title: 'OptiSEO App',
      description: 'SEO toolkit for analyzing and optimizing websites.',
      keywords: 'seo, analysis, meta tags',
      author: 'OptiSEO',
      canonical: 'https://example.com',
      image: 'https://example.com/cover.jpg',
      type: 'website',
    },
    'robots-txt-generator': {
      domain: 'https://example.com',
      allow: '/',
      disallow: '/admin\n/private',
      crawlDelay: '5',
      sitemap: 'https://example.com/sitemap.xml',
    },
    'xml-sitemap-generator': {
      domain: 'https://example.com',
      paths: '/\n/blog\n/contact',
      changefreq: 'weekly',
      priority: '0.8',
    },
    'backlink-checker': { url: 'https://example.com' },
    'domain-authority': { url: 'https://example.com' },
    'broken-link-checker': { url: 'https://example.com' },
    'schema-markup': {
      schema: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Example Article"\n}',
    },
    'plagiarism-checker': {
      text: 'Paste your article here. Repeat a sentence. Repeat a sentence.',
    },
    'keyword-density': {
      text: 'SEO helps websites rank better in search. SEO also improves visibility and traffic.',
      keyword: 'SEO',
    },
    'website-analysis': { url: 'https://example.com' },
    'ai-blog-generator': {
      topic: 'Technical SEO Checklist',
      audience: 'Marketing teams',
      tone: 'Professional',
      keywords: 'technical seo, site audit, search visibility',
    },
    'ai-article-rewriter': {
      text: 'This guide will help you improve your website performance and show quick wins for SEO.',
      tone: 'Formal',
    },
    'css-minifier': {
      code: 'body {\n  color: #111827;\n  margin: 0;\n}\n\n.card {\n  padding: 16px;\n}',
    },
    'js-minifier': {
      code: 'function greet(name) {\n  // display greeting\n  console.log("Hello " + name);\n}\n\ngreet("world");',
    },
    'word-counter': { text: 'Paste text here to count words, characters, lines, and reading time.' },
    'image-compressor': {
      originalSizeKb: '',
      width: '',
      height: '',
      quality: '70',
    },
    'what-is-my-ip': {},
    'server-status': { url: 'https://example.com' },
    'favicon-generator': {
      brandName: 'Opti SEO',
    },
    'utm-builder': {
      url: 'https://example.com/pricing',
      source: 'newsletter',
      medium: 'email',
      campaign: 'spring-launch',
      term: '',
      content: 'hero-button',
    },
    'json-formatter': {
      json: '{ "name": "OptiSEO", "type": "toolkit", "features": ["analyzer", "generator"] }',
    },
    'md5-generator': { text: 'Hash this text' },
    'title-tag-preview': {
      title: 'Technical SEO Checklist for Startups | OptiSEO',
      url: 'https://example.com/blog/technical-seo-checklist',
    },
    'meta-description-checker': {
      description: 'Learn how to run a technical SEO audit with a practical checklist, clear priorities, and implementation steps for better rankings.',
    },
    'open-graph-generator': {
      title: 'Technical SEO Checklist for Startups',
      description: 'A practical technical SEO checklist to improve indexing, speed, and visibility.',
      url: 'https://example.com/blog/technical-seo-checklist',
      image: 'https://example.com/images/technical-seo-cover.jpg',
      type: 'article',
    },
    'twitter-card-generator': {
      title: 'Technical SEO Checklist for Startups',
      description: 'Follow this checklist to fix crawl issues and improve visibility.',
      url: 'https://example.com/blog/technical-seo-checklist',
      image: 'https://example.com/images/technical-seo-cover.jpg',
      card: 'summary_large_image',
    },
    'canonical-url-checker': {
      pageUrl: 'https://example.com/blog/technical-seo-checklist?ref=home',
      canonicalUrl: 'https://example.com/blog/technical-seo-checklist',
    },
    'hreflang-generator': {
      mappings: 'en|https://example.com/en/technical-seo-checklist\nur|https://example.com/ur/technical-seo-checklist',
      xDefault: 'https://example.com/technical-seo-checklist',
    },
    'hreflang-validator': {
      mappings: 'en|https://example.com/en/technical-seo-checklist\nur|https://example.com/ur/technical-seo-checklist',
    },
    'redirect-checker': { url: 'http://example.com' },
    'http-header-checker': { url: 'https://example.com' },
    'meta-robots-checker': { url: 'https://example.com' },
    'x-robots-tag-checker': { url: 'https://example.com' },
    'sitemap-validator': {
      sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/</loc></url>\n  <url><loc>https://example.com/blog</loc></url>\n</urlset>',
    },
    'sitemap-url-extractor': {
      sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/</loc></url>\n  <url><loc>https://example.com/blog</loc></url>\n</urlset>',
    },
    'robots-tester': {
      robotsTxt: 'User-agent: *\nDisallow: /admin\nAllow: /',
      testUrl: 'https://example.com/admin',
    },
    'serp-snippet-optimizer': {
      title: 'Technical SEO Checklist for Startups',
      description: 'Improve crawlability, indexing, and page speed using this practical technical SEO checklist.',
      url: 'https://example.com/blog/technical-seo-checklist',
    },
    'keyword-suggestion-generator': {
      keyword: 'technical seo',
      count: '10',
    },
    'long-tail-keyword-finder': {
      keyword: 'technical seo',
      count: '12',
    },
    'keyword-difficulty-estimator': {
      keyword: 'technical seo checklist',
      domainAuthority: '45',
    },
    'search-intent-classifier': {
      keyword: 'best technical seo tools',
    },
    'faq-schema-generator': {
      faqPairs: 'What is technical SEO?|Technical SEO improves crawlability, indexing, and site performance.\nHow often should I do an SEO audit?|Run a focused audit every month and a full audit every quarter.',
    },
    'product-schema-generator': {
      name: 'SEO Audit Template',
      description: 'A practical SEO audit template for marketers and founders.',
      brand: 'OptiSEO',
      sku: 'SEO-AUDIT-001',
      price: '29',
      currency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://example.com/products/seo-audit-template',
    },
    'article-schema-generator': {
      headline: 'Technical SEO Checklist for Startups',
      description: 'A practical guide to improve technical SEO fundamentals.',
      author: 'OptiSEO Team',
      publishedDate: '2026-01-10',
      url: 'https://example.com/blog/technical-seo-checklist',
    },
    'local-business-schema-generator': {
      name: 'OptiSEO Agency',
      phone: '+1-555-123-4567',
      address: '123 Market St',
      city: 'San Francisco',
      country: 'US',
      website: 'https://example.com',
    },
    'breadcrumb-schema-generator': {
      items: 'Home|https://example.com\nBlog|https://example.com/blog\nTechnical SEO Checklist|https://example.com/blog/technical-seo-checklist',
    },
    'internal-link-suggestor': {
      targetKeywords: 'technical seo\nsite audit\ncore web vitals',
      existingPages: 'https://example.com/blog/on-page-seo|On-Page SEO Guide\nhttps://example.com/blog/core-web-vitals|Core Web Vitals Basics\nhttps://example.com/blog/seo-audit|SEO Audit Template',
    },
    'anchor-text-analyzer': {
      anchors: 'technical seo checklist\nclick here\nbest technical seo tools\nread more\nOptiSEO audit service',
      targetKeyword: 'technical seo checklist',
    },
    'page-speed-hint-checker': {
      lcp: '3.2',
      cls: '0.18',
      inp: '280',
      imageWeightKb: '1800',
      jsWeightKb: '900',
    },
    'core-web-vitals-estimator': {
      lcp: '2.8',
      cls: '0.12',
      inp: '260',
    },
    'mobile-friendly-checklist': {
      viewport: 'yes',
      responsive: 'yes',
      tapTargets: 'yes',
      fontSize: '16',
    },
    'ssl-https-checker': { url: 'https://example.com' },
    'seo-title-idea-generator': {
      topic: 'Technical SEO Checklist',
      keyword: 'technical seo checklist',
      brand: 'OptiSEO',
      count: '5',
    },
    'meta-description-idea-generator': {
      topic: 'Technical SEO Checklist',
      keyword: 'technical seo checklist',
      cta: 'Read the full checklist now.',
      count: '5',
    },
    'seo-slug-generator': {
      title: 'Technical SEO Checklist for Startups',
    },
    'keyword-clusterer': {
      keywords: 'technical seo checklist\nseo audit template\nseo audit guide\nkeyword research strategy\nkeyword research tools',
    },
    'keyword-intent-breakdown': {
      keywords: 'what is technical seo\nbest seo tools\nbuy seo audit service\nseo agency near me',
    },
    'semantic-keyword-expander': {
      seedKeyword: 'technical seo',
      modifiers: 'best\nfree\nfor beginners',
      locations: 'usa\npakistan',
    },
    'seo-content-outline-generator': {
      topic: 'Technical SEO',
      primaryKeyword: 'technical seo checklist',
      audience: 'Small business owners',
    },
    'image-alt-text-helper': {
      subject: 'Laptop showing website analytics dashboard',
      context: 'Blog hero image for an SEO strategy article',
      count: '5',
    },
    'internal-link-opportunities': {
      targetKeywords: 'technical seo\nsite audit\ncore web vitals',
      existingPages: 'https://example.com/blog/on-page-seo|On-Page SEO Guide\nhttps://example.com/blog/core-web-vitals|Core Web Vitals Basics\nhttps://example.com/blog/seo-audit|SEO Audit Template',
    },
    'on-page-seo-checklist': {
      pageType: 'Blog Post',
      goal: 'Rank higher for informational queries and improve CTR',
    },
  };

  return forms[slug] ?? {};
}

function getFields(slug: string): FieldConfig[] {
  const fieldMap: Record<string, FieldConfig[]> = {
    'meta-tag-generator': [
      { key: 'title', label: 'Page Title', placeholder: 'Enter page title' },
      { key: 'description', label: 'Description', placeholder: 'Enter meta description', multiline: true },
      { key: 'keywords', label: 'Keywords', placeholder: 'seo, analytics, marketing' },
      { key: 'author', label: 'Author', placeholder: 'Author name' },
      { key: 'canonical', label: 'Canonical URL', placeholder: 'https://example.com/page', keyboardType: 'url' },
      { key: 'image', label: 'OG Image URL', placeholder: 'https://example.com/image.jpg', keyboardType: 'url' },
      { key: 'type', label: 'Open Graph Type', placeholder: 'website' },
    ],
    'robots-txt-generator': [
      { key: 'domain', label: 'Domain', placeholder: 'https://example.com', keyboardType: 'url' },
      { key: 'allow', label: 'Allow Paths', placeholder: '/\n/blog', multiline: true },
      { key: 'disallow', label: 'Disallow Paths', placeholder: '/admin\n/private', multiline: true },
      { key: 'crawlDelay', label: 'Crawl Delay', placeholder: '5', keyboardType: 'numeric' },
      { key: 'sitemap', label: 'Sitemap URL', placeholder: 'https://example.com/sitemap.xml', keyboardType: 'url' },
    ],
    'xml-sitemap-generator': [
      { key: 'domain', label: 'Domain', placeholder: 'https://example.com', keyboardType: 'url' },
      { key: 'paths', label: 'Paths', placeholder: '/\n/blog\n/contact', multiline: true },
      { key: 'changefreq', label: 'Change Frequency', placeholder: 'weekly' },
      { key: 'priority', label: 'Priority', placeholder: '0.8' },
    ],
    'backlink-checker': [{ key: 'url', label: 'Page URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'domain-authority': [{ key: 'url', label: 'Page URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'broken-link-checker': [{ key: 'url', label: 'Page URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'schema-markup': [{ key: 'schema', label: 'JSON-LD', placeholder: 'Paste schema JSON', multiline: true }],
    'plagiarism-checker': [{ key: 'text', label: 'Text', placeholder: 'Paste content here', multiline: true }],
    'keyword-density': [
      { key: 'text', label: 'Text', placeholder: 'Paste content here', multiline: true },
      { key: 'keyword', label: 'Focus Keyword', placeholder: 'seo' },
    ],
    'website-analysis': [{ key: 'url', label: 'Website URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'ai-blog-generator': [
      { key: 'topic', label: 'Topic', placeholder: 'Technical SEO Checklist' },
      { key: 'audience', label: 'Audience', placeholder: 'Marketing teams' },
      { key: 'tone', label: 'Tone', placeholder: 'Professional' },
      { key: 'keywords', label: 'Keywords', placeholder: 'seo, audit, rankings' },
    ],
    'ai-article-rewriter': [
      { key: 'text', label: 'Original Article', placeholder: 'Paste article here', multiline: true },
      { key: 'tone', label: 'Rewrite Tone', placeholder: 'Formal' },
    ],
    'css-minifier': [{ key: 'code', label: 'CSS', placeholder: 'Paste CSS here', multiline: true }],
    'js-minifier': [{ key: 'code', label: 'JavaScript', placeholder: 'Paste JavaScript here', multiline: true }],
    'word-counter': [{ key: 'text', label: 'Text', placeholder: 'Paste content here', multiline: true }],
    'image-compressor': [
      { key: 'originalSizeKb', label: 'Original Size (KB)', placeholder: 'Auto-filled after upload', keyboardType: 'numeric' },
      { key: 'width', label: 'Width', placeholder: 'Auto-filled after upload', keyboardType: 'numeric' },
      { key: 'height', label: 'Height', placeholder: 'Auto-filled after upload', keyboardType: 'numeric' },
      { key: 'quality', label: 'Target Quality', placeholder: '70', keyboardType: 'numeric' },
    ],
    'server-status': [{ key: 'url', label: 'Website URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'favicon-generator': [
      { key: 'brandName', label: 'Brand Name', placeholder: 'Opti SEO' },
    ],
    'utm-builder': [
      { key: 'url', label: 'Destination URL', placeholder: 'https://example.com', keyboardType: 'url' },
      { key: 'source', label: 'Source', placeholder: 'newsletter' },
      { key: 'medium', label: 'Medium', placeholder: 'email' },
      { key: 'campaign', label: 'Campaign', placeholder: 'spring-launch' },
      { key: 'term', label: 'Term', placeholder: 'seo tools' },
      { key: 'content', label: 'Content', placeholder: 'hero-button' },
    ],
    'json-formatter': [{ key: 'json', label: 'JSON', placeholder: 'Paste JSON here', multiline: true }],
    'md5-generator': [{ key: 'text', label: 'Text', placeholder: 'Enter text to hash', multiline: true }],
    'title-tag-preview': [
      { key: 'title', label: 'Title Tag', placeholder: 'Technical SEO Checklist for Startups' },
      { key: 'url', label: 'URL', placeholder: 'https://example.com/blog/post', keyboardType: 'url' },
    ],
    'meta-description-checker': [
      { key: 'description', label: 'Meta Description', placeholder: 'Enter meta description', multiline: true },
    ],
    'open-graph-generator': [
      { key: 'title', label: 'Title', placeholder: 'Page title' },
      { key: 'description', label: 'Description', placeholder: 'OG description', multiline: true },
      { key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' },
      { key: 'image', label: 'Image URL', placeholder: 'https://example.com/image.jpg', keyboardType: 'url' },
      { key: 'type', label: 'Type', placeholder: 'website or article' },
    ],
    'twitter-card-generator': [
      { key: 'title', label: 'Title', placeholder: 'Page title' },
      { key: 'description', label: 'Description', placeholder: 'Twitter description', multiline: true },
      { key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' },
      { key: 'image', label: 'Image URL', placeholder: 'https://example.com/image.jpg', keyboardType: 'url' },
      { key: 'card', label: 'Card Type', placeholder: 'summary_large_image' },
    ],
    'canonical-url-checker': [
      { key: 'pageUrl', label: 'Page URL', placeholder: 'https://example.com/page?ref=abc', keyboardType: 'url' },
      { key: 'canonicalUrl', label: 'Canonical URL', placeholder: 'https://example.com/page', keyboardType: 'url' },
    ],
    'hreflang-generator': [
      { key: 'mappings', label: 'Mappings (lang|url)', placeholder: 'en|https://example.com/en/page', multiline: true },
      { key: 'xDefault', label: 'x-default URL', placeholder: 'https://example.com/page', keyboardType: 'url' },
    ],
    'hreflang-validator': [
      { key: 'mappings', label: 'Mappings (lang|url)', placeholder: 'en|https://example.com/en/page', multiline: true },
    ],
    'redirect-checker': [{ key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'http-header-checker': [{ key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'meta-robots-checker': [{ key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'x-robots-tag-checker': [{ key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' }],
    'sitemap-validator': [{ key: 'sitemap', label: 'Sitemap XML', placeholder: 'Paste sitemap XML', multiline: true }],
    'sitemap-url-extractor': [{ key: 'sitemap', label: 'Sitemap XML', placeholder: 'Paste sitemap XML', multiline: true }],
    'robots-tester': [
      { key: 'robotsTxt', label: 'Robots.txt', placeholder: 'User-agent: *\nDisallow: /admin', multiline: true },
      { key: 'testUrl', label: 'Test URL', placeholder: 'https://example.com/admin', keyboardType: 'url' },
    ],
    'serp-snippet-optimizer': [
      { key: 'title', label: 'Title', placeholder: 'Title tag' },
      { key: 'description', label: 'Description', placeholder: 'Meta description', multiline: true },
      { key: 'url', label: 'URL', placeholder: 'https://example.com/page', keyboardType: 'url' },
    ],
    'keyword-suggestion-generator': [
      { key: 'keyword', label: 'Seed Keyword', placeholder: 'technical seo' },
      { key: 'count', label: 'Suggestions Count', placeholder: '10', keyboardType: 'numeric' },
    ],
    'long-tail-keyword-finder': [
      { key: 'keyword', label: 'Seed Keyword', placeholder: 'technical seo' },
      { key: 'count', label: 'Suggestions Count', placeholder: '12', keyboardType: 'numeric' },
    ],
    'keyword-difficulty-estimator': [
      { key: 'keyword', label: 'Keyword', placeholder: 'technical seo checklist' },
      { key: 'domainAuthority', label: 'Domain Authority (0-100)', placeholder: '45', keyboardType: 'numeric' },
    ],
    'search-intent-classifier': [
      { key: 'keyword', label: 'Keyword', placeholder: 'best technical seo tools' },
    ],
    'faq-schema-generator': [
      { key: 'faqPairs', label: 'FAQ Pairs (Question|Answer)', placeholder: 'What is SEO?|SEO is...', multiline: true },
    ],
    'product-schema-generator': [
      { key: 'name', label: 'Product Name', placeholder: 'SEO Audit Template' },
      { key: 'description', label: 'Description', placeholder: 'Product description', multiline: true },
      { key: 'brand', label: 'Brand', placeholder: 'OptiSEO' },
      { key: 'sku', label: 'SKU', placeholder: 'SEO-AUDIT-001' },
      { key: 'price', label: 'Price', placeholder: '29', keyboardType: 'numeric' },
      { key: 'currency', label: 'Currency', placeholder: 'USD' },
      { key: 'availability', label: 'Availability URL', placeholder: 'https://schema.org/InStock', keyboardType: 'url' },
      { key: 'url', label: 'Product URL', placeholder: 'https://example.com/product', keyboardType: 'url' },
    ],
    'article-schema-generator': [
      { key: 'headline', label: 'Headline', placeholder: 'Technical SEO Checklist for Startups' },
      { key: 'description', label: 'Description', placeholder: 'Article description', multiline: true },
      { key: 'author', label: 'Author', placeholder: 'OptiSEO Team' },
      { key: 'publishedDate', label: 'Published Date', placeholder: '2026-01-10' },
      { key: 'url', label: 'Article URL', placeholder: 'https://example.com/blog/post', keyboardType: 'url' },
    ],
    'local-business-schema-generator': [
      { key: 'name', label: 'Business Name', placeholder: 'OptiSEO Agency' },
      { key: 'phone', label: 'Phone', placeholder: '+1-555-123-4567' },
      { key: 'address', label: 'Address', placeholder: '123 Market St' },
      { key: 'city', label: 'City', placeholder: 'San Francisco' },
      { key: 'country', label: 'Country Code', placeholder: 'US' },
      { key: 'website', label: 'Website', placeholder: 'https://example.com', keyboardType: 'url' },
    ],
    'breadcrumb-schema-generator': [
      { key: 'items', label: 'Items (name|url)', placeholder: 'Home|https://example.com', multiline: true },
    ],
    'internal-link-suggestor': [
      { key: 'targetKeywords', label: 'Target Keywords', placeholder: 'technical seo\nsite audit', multiline: true },
      { key: 'existingPages', label: 'Existing Pages (url|title)', placeholder: 'https://example.com/page|Title', multiline: true },
    ],
    'anchor-text-analyzer': [
      { key: 'anchors', label: 'Anchor Texts', placeholder: 'click here\ntechnical seo checklist', multiline: true },
      { key: 'targetKeyword', label: 'Target Keyword (optional)', placeholder: 'technical seo checklist' },
    ],
    'page-speed-hint-checker': [
      { key: 'lcp', label: 'LCP (seconds)', placeholder: '3.2', keyboardType: 'numeric' },
      { key: 'cls', label: 'CLS', placeholder: '0.18', keyboardType: 'numeric' },
      { key: 'inp', label: 'INP (ms)', placeholder: '280', keyboardType: 'numeric' },
      { key: 'imageWeightKb', label: 'Total Image Weight (KB)', placeholder: '1800', keyboardType: 'numeric' },
      { key: 'jsWeightKb', label: 'Total JS Weight (KB)', placeholder: '900', keyboardType: 'numeric' },
    ],
    'core-web-vitals-estimator': [
      { key: 'lcp', label: 'LCP (seconds)', placeholder: '2.8', keyboardType: 'numeric' },
      { key: 'cls', label: 'CLS', placeholder: '0.12', keyboardType: 'numeric' },
      { key: 'inp', label: 'INP (ms)', placeholder: '260', keyboardType: 'numeric' },
    ],
    'mobile-friendly-checklist': [
      { key: 'viewport', label: 'Viewport Meta (yes/no)', placeholder: 'yes' },
      { key: 'responsive', label: 'Responsive Layout (yes/no)', placeholder: 'yes' },
      { key: 'tapTargets', label: 'Tap Targets Adequate (yes/no)', placeholder: 'yes' },
      { key: 'fontSize', label: 'Base Font Size (px)', placeholder: '16', keyboardType: 'numeric' },
    ],
    'ssl-https-checker': [
      { key: 'url', label: 'URL', placeholder: 'https://example.com', keyboardType: 'url' },
    ],
    'seo-title-idea-generator': [
      { key: 'topic', label: 'Topic', placeholder: 'Technical SEO Checklist' },
      { key: 'keyword', label: 'Primary Keyword', placeholder: 'technical seo checklist' },
      { key: 'brand', label: 'Brand', placeholder: 'OptiSEO' },
      { key: 'count', label: 'Number of Ideas', placeholder: '5', keyboardType: 'numeric' },
    ],
    'meta-description-idea-generator': [
      { key: 'topic', label: 'Topic', placeholder: 'Technical SEO Checklist' },
      { key: 'keyword', label: 'Primary Keyword', placeholder: 'technical seo checklist' },
      { key: 'cta', label: 'CTA', placeholder: 'Read the full checklist now.' },
      { key: 'count', label: 'Number of Ideas', placeholder: '5', keyboardType: 'numeric' },
    ],
    'seo-slug-generator': [
      { key: 'title', label: 'Page Title', placeholder: 'Technical SEO Checklist for Startups' },
    ],
    'keyword-clusterer': [
      { key: 'keywords', label: 'Keywords (comma/new line)', placeholder: 'keyword 1\nkeyword 2', multiline: true },
    ],
    'keyword-intent-breakdown': [
      { key: 'keywords', label: 'Keywords (comma/new line)', placeholder: 'what is seo\nbest seo tools', multiline: true },
    ],
    'semantic-keyword-expander': [
      { key: 'seedKeyword', label: 'Seed Keyword', placeholder: 'technical seo' },
      { key: 'modifiers', label: 'Modifiers', placeholder: 'best\nfree\nfor beginners', multiline: true },
      { key: 'locations', label: 'Locations (optional)', placeholder: 'usa\npakistan', multiline: true },
    ],
    'seo-content-outline-generator': [
      { key: 'topic', label: 'Topic', placeholder: 'Technical SEO' },
      { key: 'primaryKeyword', label: 'Primary Keyword', placeholder: 'technical seo checklist' },
      { key: 'audience', label: 'Audience', placeholder: 'Small business owners' },
    ],
    'image-alt-text-helper': [
      { key: 'subject', label: 'Image Subject', placeholder: 'Laptop showing website analytics dashboard' },
      { key: 'context', label: 'Context', placeholder: 'Blog hero image for an SEO strategy article', multiline: true },
      { key: 'count', label: 'Number of Suggestions', placeholder: '5', keyboardType: 'numeric' },
    ],
    'internal-link-opportunities': [
      { key: 'targetKeywords', label: 'Target Keywords', placeholder: 'technical seo\nsite audit', multiline: true },
      {
        key: 'existingPages',
        label: 'Existing Pages (url|title per line)',
        placeholder: 'https://example.com/blog/seo-audit|SEO Audit Template',
        multiline: true,
      },
    ],
    'on-page-seo-checklist': [
      { key: 'pageType', label: 'Page Type', placeholder: 'Blog Post' },
      { key: 'goal', label: 'Primary Goal', placeholder: 'Rank for informational queries and improve CTR', multiline: true },
    ],
  };

  return fieldMap[slug] ?? [];
}

function formatWebsiteReport(report: Awaited<ReturnType<typeof analyzeWebsite>>) {
  return [
    `Final URL: ${report.finalUrl}`,
    `Title: ${report.title}`,
    `Description: ${report.description}`,
    `Canonical: ${report.canonical}`,
    `H1: ${report.h1}`,
    `Robots: ${report.robots}`,
    `Word Count: ${report.wordCount}`,
    `Images: ${report.imageCount}`,
    `Internal Links: ${report.internalLinks}`,
    `External Links: ${report.externalLinks}`,
    '',
    'Missing Signals:',
    ...(report.missing.length ? report.missing.map((item) => `- ${item}`) : ['- None']),
  ].join('\n');
}

function resolveImageDimensions(uri: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    RNImage.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
}

function getResizeDimensions(
  originalWidth: number,
  originalHeight: number,
  requestedWidth: string,
  requestedHeight: string
) {
  const parsedWidth = Math.round(Number(requestedWidth) || 0);
  const parsedHeight = Math.round(Number(requestedHeight) || 0);

  if (parsedWidth > 0 && parsedHeight > 0) {
    return {
      width: Math.max(16, parsedWidth),
      height: Math.max(16, parsedHeight),
    };
  }

  if (parsedWidth > 0 && originalWidth > 0 && originalHeight > 0) {
    return {
      width: Math.max(16, parsedWidth),
      height: Math.max(16, Math.round((parsedWidth / originalWidth) * originalHeight)),
    };
  }

  if (parsedHeight > 0 && originalWidth > 0 && originalHeight > 0) {
    return {
      width: Math.max(16, Math.round((parsedHeight / originalHeight) * originalWidth)),
      height: Math.max(16, parsedHeight),
    };
  }

  return {
    width: Math.max(16, originalWidth || 1200),
    height: Math.max(16, originalHeight || 630),
  };
}

function formatSizeKb(size?: number) {
  if (!size) {
    return 'Unknown';
  }

  return `${Math.max(1, Math.round(size / 1024))}`;
}

function getSaveFormat(mimeType?: string | null) {
  if (mimeType?.includes('png')) {
    return ImageManipulator.SaveFormat.PNG;
  }

  return ImageManipulator.SaveFormat.JPEG;
}

function getBaseFileName(fileName?: string | null) {
  if (!fileName) {
    return 'image';
  }

  const normalized = fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').trim();
  const withoutExtension = normalized.replace(/\.[^.]+$/, '');

  return withoutExtension || 'image';
}

function parseList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePipeRows(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, right] = line.split('|').map((item) => item.trim());
      return { left: left ?? '', right: right ?? '' };
    });
}

function getNumeric(value: string, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}

function clip(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}

function classifySearchIntent(keyword: string) {
  const value = keyword.toLowerCase();
  if (/\b(near me|in [a-z]{2,}|city|local|open now)\b/.test(value)) {
    return 'Local';
  }
  if (/\b(buy|price|cost|quote|hire|service|agency|order)\b/.test(value)) {
    return 'Transactional';
  }
  if (/\b(best|top|review|compare|vs|alternative|software|tool)\b/.test(value)) {
    return 'Commercial';
  }
  if (/\b(login|sign in|official|homepage|contact)\b/.test(value)) {
    return 'Navigational';
  }
  return 'Informational';
}

export default function ToolDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const tool = slug ? toolsBySlug[slug] : undefined;
  const [form, setForm] = useState<Record<string, string>>(() => getInitialForm(slug ?? ''));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [downloadAssets, setDownloadAssets] = useState<DownloadAsset[]>([]);
  const fields = useMemo(() => getFields(slug ?? ''), [slug]);
  const supportsImageUpload = tool?.slug === 'image-compressor' || tool?.slug === 'favicon-generator';

  useEffect(() => {
    setForm(getInitialForm(slug ?? ''));
    setLoading(false);
    setResult('');
    setSelectedImage(null);
    setPreviewTitle('');
    setPreviewImages([]);
    setDownloadAssets([]);
  }, [slug]);

  if (!tool) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Tool not found</Text>
      </View>
    );
  }

  const setValue = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const applySelectedImage = async (asset: {
    uri: string;
    name?: string | null;
    size?: number;
    mimeType?: string | null;
    width?: number;
    height?: number;
  }) => {
    let workingUri = asset.uri;
    let width = asset.width ?? 0;
    let height = asset.height ?? 0;

    if (!width || !height) {
      try {
        const dimensions = await resolveImageDimensions(asset.uri);
        width = dimensions.width;
        height = dimensions.height;
      } catch {
        const normalized = await ImageManipulator.manipulateAsync(
          asset.uri,
          [],
          { compress: 1, format: getSaveFormat(asset.mimeType) }
        );
        workingUri = normalized.uri;
        width = normalized.width;
        height = normalized.height;
      }
    }

    const uploadedImage: UploadedImage = {
      uri: workingUri,
      width,
      height,
      fileSize: asset.size,
      fileName: asset.name,
      mimeType: asset.mimeType,
    };

    setSelectedImage(uploadedImage);
    setPreviewTitle('');
    setPreviewImages([]);
    setResult('');
    setDownloadAssets([]);

    if (tool.slug === 'image-compressor') {
      setForm((current) => ({
        ...current,
        originalSizeKb: asset.size ? `${Math.max(1, Math.round(asset.size / 1024))}` : current.originalSizeKb,
        width: width ? `${width}` : current.width,
        height: height ? `${height}` : current.height,
      }));
    }
  };

  const pickImage = async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (response.canceled || !response.assets.length) {
        return;
      }

      const asset = response.assets[0];
      await applySelectedImage({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to select image from files.';
      Alert.alert('Files Selection Failed', `${message}\n\nUsing the gallery as a fallback.`);
      await pickImageFromGallery();
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Allow gallery access or select an image from files.');
        return;
      }

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      if (response.canceled || !response.assets.length) {
        return;
      }

      const asset = response.assets[0];
      await applySelectedImage({
        uri: asset.uri,
        name: asset.fileName,
        size: asset.fileSize,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to select image.';
      Alert.alert('Image Selection Failed', message);
    }
  };

  const downloadAsset = async (asset: DownloadAsset) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(asset.uri, {
          mimeType: asset.mimeType,
          dialogTitle: `Download ${asset.fileName}`,
          UTI: asset.mimeType,
        });
        return;
      }

      await Linking.openURL(asset.uri);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to open download.';
      Alert.alert('Download Failed', message);
    }
  };

  const persistGeneratedAsset = async (sourceUri: string, fileName: string) => {
    const documentDirectory = FileSystem.documentDirectory;
    if (!documentDirectory) {
      return sourceUri;
    }

    const outputDirectory = `${documentDirectory}downloads/`;

    await FileSystem.makeDirectoryAsync(outputDirectory, { intermediates: true });

    const destinationUri = `${outputDirectory}${fileName}`;
    const existing = await FileSystem.getInfoAsync(destinationUri);

    if (existing.exists) {
      await FileSystem.deleteAsync(destinationUri, { idempotent: true });
    }

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  };

  const getFileSizeKb = async (uri: string) => {
    const info = await FileSystem.getInfoAsync(uri);
    if ('size' in info && typeof info.size === 'number') {
      return Math.max(1, Math.round(info.size / 1024));
    }
    return 0;
  };

  const runTool = async () => {
    try {
      setLoading(true);
      setPreviewTitle('');
      setPreviewImages([]);
      setDownloadAssets([]);
      let output = '';

      switch (tool.slug) {
        case 'meta-tag-generator':
          output = generateMetaTags(form as never);
          break;
        case 'robots-txt-generator':
          output = generateRobotsTxt(form as never);
          break;
        case 'xml-sitemap-generator':
          output = generateSitemapXml(form as never);
          break;
        case 'backlink-checker': {
          const report = await inspectBacklinks(form.url);
          output = [
            `Final URL: ${report.finalUrl}`,
            `Total External Links: ${report.totalExternalLinks}`,
            `Unique Domains: ${report.uniqueDomains}`,
            '',
            'Links:',
            ...(report.links.length ? report.links.map((link) => `- ${link}`) : ['- None found']),
          ].join('\n');
          break;
        }
        case 'domain-authority': {
          const report = await estimateDomainAuthority(form.url);
          output = [
            `Estimated Authority Score: ${report.score}/100`,
            `Grade: ${report.grade}`,
            '',
            'Why:',
            ...report.reasons.map((reason) => `- ${reason}`),
            '',
            formatWebsiteReport(report.report),
          ].join('\n');
          break;
        }
        case 'broken-link-checker': {
          const report = await checkBrokenLinks(form.url);
          output = [
            `Checked Links: ${report.checked}`,
            `Broken Links: ${report.broken.length}`,
            '',
            'Broken:',
            ...(report.broken.length ? report.broken.map((item) => `- ${item.url} (${item.status})`) : ['- None']),
            '',
            'Healthy:',
            ...(report.healthy.length ? report.healthy.slice(0, 8).map((item) => `- ${item.url} (${item.status})`) : ['- None']),
          ].join('\n');
          break;
        }
        case 'schema-markup': {
          const schema = validateSchemaMarkup(form.schema);
          output = [
            `Valid: ${schema.valid ? 'Yes' : 'No'}`,
            '',
            'Issues:',
            ...(schema.issues.length ? schema.issues.map((issue) => `- ${issue}`) : ['- None']),
            '',
            'Formatted JSON:',
            schema.formatted,
          ].join('\n');
          break;
        }
        case 'plagiarism-checker': {
          const report = checkPlagiarism(form.text);
          output = [
            `Sentences: ${report.sentenceCount}`,
            `Duplicate Sentences: ${report.duplicateSentenceCount}`,
            `Duplicate Rate: ${report.duplicateRate}`,
            '',
            'Repeated Phrases:',
            ...(report.repeatedPhrases.length ? report.repeatedPhrases.map((phrase) => `- ${phrase}`) : ['- None']),
          ].join('\n');
          break;
        }
        case 'keyword-density': {
          const report = buildKeywordDensity(form.text, form.keyword);
          output = [
            `Total Words: ${report.totalWords}`,
            `Focus Keyword Count: ${report.focusKeywordCount}`,
            `Focus Keyword Density: ${report.focusKeywordDensity}`,
            '',
            'Top Keywords:',
            ...report.topKeywords.map((row) => `- ${row.keyword}: ${row.count} (${row.density})`),
          ].join('\n');
          break;
        }
        case 'website-analysis': {
          const report = await analyzeWebsite(form.url);
          output = formatWebsiteReport(report);
          break;
        }
        case 'ai-blog-generator':
          output = generateBlogDraft(form as never);
          break;
        case 'ai-article-rewriter':
          output = rewriteArticle(form.text, form.tone || 'Formal');
          break;
        case 'css-minifier':
          output = minifyCss(form.code);
          break;
        case 'js-minifier':
          output = minifyJs(form.code);
          break;
        case 'word-counter': {
          const counts = countWords(form.text);
          output = [
            `Words: ${counts.words}`,
            `Characters: ${counts.characters}`,
            `Characters Without Spaces: ${counts.charactersNoSpaces}`,
            `Lines: ${counts.lines}`,
            `Paragraphs: ${counts.paragraphs}`,
            `Estimated Reading Time: ${counts.readingMinutes} min`,
          ].join('\n');
          break;
        }
        case 'image-compressor': {
          if (!selectedImage) {
            throw new Error('Please upload an image first.');
          }

          const targetSize = getResizeDimensions(
            selectedImage.width,
            selectedImage.height,
            form.width,
            form.height
          );
          const quality = Math.min(100, Math.max(10, Number(form.quality) || 70));
          const compressed = await ImageManipulator.manipulateAsync(
            selectedImage.uri,
            [{ resize: targetSize }],
            { compress: quality / 100, format: ImageManipulator.SaveFormat.JPEG }
          );
          const compressedFileName = `${getBaseFileName(selectedImage.fileName)}-compressed.jpg`;
          const savedCompressedUri = await persistGeneratedAsset(compressed.uri, compressedFileName);
          const originalSizeKb = selectedImage.fileSize
            ? Math.max(1, Math.round(selectedImage.fileSize / 1024))
            : Number(form.originalSizeKb) || 0;
          const compressedSizeKb = await getFileSizeKb(savedCompressedUri);
          const savedKb = Math.max(0, originalSizeKb - compressedSizeKb);
          const savedPercent = originalSizeKb ? Math.max(0, Math.round((savedKb / originalSizeKb) * 100)) : 0;

          setPreviewTitle('Before / After');
          setPreviewImages([
            {
              label: 'Original',
              uri: selectedImage.uri,
              width: selectedImage.width,
              height: selectedImage.height,
              fileName: selectedImage.fileName ?? 'source-image',
              mimeType: selectedImage.mimeType ?? 'image/jpeg',
            },
            {
              label: 'Compressed',
              uri: savedCompressedUri,
              width: compressed.width,
              height: compressed.height,
              fileName: compressedFileName,
              mimeType: 'image/jpeg',
            },
          ]);
          setDownloadAssets([
            {
              label: 'Download Compressed Image',
              uri: savedCompressedUri,
              fileName: compressedFileName,
              mimeType: 'image/jpeg',
            },
          ]);

          output = [
            `File Name: ${selectedImage.fileName ?? 'uploaded-image'}`,
            `Original Size: ${originalSizeKb || 'Unknown'} KB`,
            `Compressed Size: ${compressedSizeKb || 'Unknown'} KB`,
            `Optimized Size: ${compressed.width}x${compressed.height}`,
            `Compression Quality: ${quality}%`,
            `Saved: ${savedKb} KB (${savedPercent}%)`,
            '',
            'Downloaded Compressed Image:',
            savedCompressedUri,
          ].join('\n');
          break;
        }
        case 'what-is-my-ip':
          output = `Public IP: ${await getPublicIp()}`;
          break;
        case 'server-status': {
          const report = await checkServerStatus(form.url);
          output = [
            `URL: ${report.url}`,
            `Status: ${report.ok ? 'Online' : 'Issue detected'}`,
            `Status Code: ${report.statusCode}`,
            `Response Time: ${report.responseTimeMs} ms`,
          ].join('\n');
          break;
        }
        case 'favicon-generator': {
          if (!selectedImage) {
            throw new Error('Please upload an image first.');
          }

          const iconSpecs = [
            { fileName: 'favicon-16x16.png', size: 16 },
            { fileName: 'favicon-32x32.png', size: 32 },
            { fileName: 'favicon-48x48.png', size: 48 },
            { fileName: 'favicon-64x64.png', size: 64 },
            { fileName: 'apple-touch-icon.png', size: 180 },
            { fileName: 'android-chrome-192x192.png', size: 192 },
            { fileName: 'android-chrome-512x512.png', size: 512 },
          ];
          const icons = await Promise.all(
            iconSpecs.map(async ({ fileName, size }) => {
              const icon = await ImageManipulator.manipulateAsync(
                selectedImage.uri,
                [{ resize: { width: size, height: size } }],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
              );
              const savedIconUri = await persistGeneratedAsset(icon.uri, fileName);

              return {
                label: `${size}x${size}`,
                uri: savedIconUri,
                width: size,
                height: size,
                fileName,
                mimeType: 'image/png',
              };
            })
          );

          setPreviewTitle('Generated Favicons');
          setPreviewImages(icons);
          setDownloadAssets(
            icons.map((icon) => ({
              label: `Download ${icon.fileName ?? icon.label}`,
              uri: icon.uri,
              fileName: icon.fileName ?? `${icon.label}.png`,
              mimeType: 'image/png',
            }))
          );

          output = [
            `Brand Name: ${form.brandName || 'Website Icon'}`,
            `Source File: ${selectedImage.fileName ?? 'uploaded-image'}`,
            '',
            'Generated Files:',
            ...icons.map((icon) => `- ${icon.fileName} (${icon.width}x${icon.height})`),
            '',
            'HTML:',
            '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />',
            '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />',
            '<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />',
            '<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png" />',
            '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
            '<link rel="manifest" href="/site.webmanifest" />',
            '',
            'Manifest:',
            JSON.stringify(
              {
                name: form.brandName || 'Website Icon',
                short_name: form.brandName || 'Icon',
                icons: [
                  {
                    src: '/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                  },
                  {
                    src: '/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                  },
                ],
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
              },
              null,
              2
            ),
          ].join('\n');
          break;
        }
        case 'utm-builder':
          output = buildUtmUrl(form as never);
          break;
        case 'json-formatter':
          output = formatJson(form.json);
          break;
        case 'title-tag-preview': {
          const title = (form.title ?? '').trim();
          const url = (form.url ?? 'https://example.com').trim();
          const length = title.length;
          const status = length >= 40 && length <= 60
            ? 'Ideal'
            : length < 40
              ? 'Too short'
              : 'Too long';
          output = [
            `Title Length: ${length}`,
            `Status: ${status}`,
            `Preview URL: ${normalizeUrl(url).replace(/^https?:\/\//, '')}`,
            '',
            'Desktop Preview:',
            clip(title || 'Untitled Page', 60),
          ].join('\n');
          break;
        }
        case 'meta-description-checker': {
          const description = (form.description ?? '').trim();
          const length = description.length;
          const words = countWords(description).words;
          const status = length >= 140 && length <= 160
            ? 'Ideal'
            : length < 140
              ? 'Too short'
              : 'Too long';
          output = [
            `Length: ${length} characters`,
            `Words: ${words}`,
            `Status: ${status}`,
            '',
            'Suggestion:',
            status === 'Ideal'
              ? '- Description length is optimized.'
              : status === 'Too short'
                ? '- Add more context and a CTA to reach 140-160 chars.'
                : '- Trim extra words and keep key value proposition first.',
          ].join('\n');
          break;
        }
        case 'open-graph-generator': {
          const title = form.title ?? '';
          const description = form.description ?? '';
          const url = normalizeUrl(form.url ?? 'https://example.com');
          const image = form.image ?? '';
          const type = (form.type ?? 'website').trim() || 'website';
          output = [
            `<meta property="og:title" content="${title}" />`,
            `<meta property="og:description" content="${description}" />`,
            `<meta property="og:type" content="${type}" />`,
            `<meta property="og:url" content="${url}" />`,
            `<meta property="og:image" content="${image}" />`,
          ].join('\n');
          break;
        }
        case 'twitter-card-generator': {
          const title = form.title ?? '';
          const description = form.description ?? '';
          const image = form.image ?? '';
          const card = (form.card ?? 'summary_large_image').trim() || 'summary_large_image';
          output = [
            `<meta name="twitter:card" content="${card}" />`,
            `<meta name="twitter:title" content="${title}" />`,
            `<meta name="twitter:description" content="${description}" />`,
            `<meta name="twitter:image" content="${image}" />`,
          ].join('\n');
          break;
        }
        case 'canonical-url-checker': {
          const pageUrl = normalizeUrl(form.pageUrl ?? 'https://example.com');
          const canonicalUrl = normalizeUrl(form.canonicalUrl ?? pageUrl);
          const page = new URL(pageUrl);
          const canonical = new URL(canonicalUrl);
          const isSamePath = `${page.origin}${page.pathname}` === `${canonical.origin}${canonical.pathname}`;
          output = [
            `Page URL: ${pageUrl}`,
            `Canonical URL: ${canonicalUrl}`,
            `Match Status: ${isSamePath ? 'Valid canonical target' : 'Canonical points to different path'}`,
            '',
            'Recommendation:',
            isSamePath
              ? '- Canonical setup looks consistent.'
              : '- If this is not an intentional canonicalization, align canonical with the primary page URL.',
          ].join('\n');
          break;
        }
        case 'hreflang-generator': {
          const rows = parsePipeRows(form.mappings ?? '');
          const tags = rows
            .filter((row) => row.left && row.right)
            .map((row) => `<link rel="alternate" hreflang="${row.left}" href="${row.right}" />`);
          if (form.xDefault?.trim()) {
            tags.push(`<link rel="alternate" hreflang="x-default" href="${form.xDefault.trim()}" />`);
          }
          output = tags.length ? tags.join('\n') : 'Add mappings in format: lang|url';
          break;
        }
        case 'hreflang-validator': {
          const rows = parsePipeRows(form.mappings ?? '').filter((row) => row.left || row.right);
          const issues: string[] = [];
          const seenLangs = new Set<string>();
          rows.forEach((row, index) => {
            const lang = row.left.toLowerCase();
            if (!row.left || !row.right) {
              issues.push(`Row ${index + 1}: Missing language or URL.`);
              return;
            }
            if (!/^[a-z]{2}(-[a-z]{2})?$/i.test(lang)) {
              issues.push(`Row ${index + 1}: Invalid language code "${row.left}".`);
            }
            if (seenLangs.has(lang)) {
              issues.push(`Row ${index + 1}: Duplicate language code "${row.left}".`);
            }
            seenLangs.add(lang);
            try {
              normalizeUrl(row.right);
            } catch {
              issues.push(`Row ${index + 1}: Invalid URL "${row.right}".`);
            }
          });
          output = [
            `Rows Checked: ${rows.length}`,
            `Valid: ${issues.length === 0 ? 'Yes' : 'No'}`,
            '',
            'Issues:',
            ...(issues.length ? issues.map((item) => `- ${item}`) : ['- None']),
          ].join('\n');
          break;
        }
        case 'redirect-checker': {
          const requestedUrl = normalizeUrl(form.url ?? 'https://example.com');
          const response = await fetch(requestedUrl);
          const finalUrl = response.url;
          const redirected = finalUrl !== requestedUrl;
          output = [
            `Requested URL: ${requestedUrl}`,
            `Final URL: ${finalUrl}`,
            `Status Code: ${response.status}`,
            `Redirected: ${redirected ? 'Yes' : 'No'}`,
          ].join('\n');
          break;
        }
        case 'http-header-checker': {
          const targetUrl = normalizeUrl(form.url ?? 'https://example.com');
          const response = await fetch(targetUrl);
          const importantHeaders = ['content-type', 'cache-control', 'x-robots-tag', 'strict-transport-security', 'server'];
          const headerLines = importantHeaders.map((header) => `- ${header}: ${response.headers.get(header) ?? 'Not found'}`);
          output = [
            `URL: ${response.url}`,
            `Status Code: ${response.status}`,
            '',
            'Important Headers:',
            ...headerLines,
          ].join('\n');
          break;
        }
        case 'meta-robots-checker': {
          const report = await analyzeWebsite(form.url ?? 'https://example.com');
          const robots = (report.robots ?? '').toLowerCase();
          const indexStatus = robots.includes('noindex') ? 'Noindex detected' : 'Index allowed';
          const followStatus = robots.includes('nofollow') ? 'Nofollow detected' : 'Follow allowed';
          output = [
            `URL: ${report.finalUrl}`,
            `Meta Robots: ${report.robots}`,
            `Index Status: ${indexStatus}`,
            `Follow Status: ${followStatus}`,
          ].join('\n');
          break;
        }
        case 'x-robots-tag-checker': {
          const targetUrl = normalizeUrl(form.url ?? 'https://example.com');
          const response = await fetch(targetUrl);
          const xRobotsTag = response.headers.get('x-robots-tag');
          output = [
            `URL: ${response.url}`,
            `Status Code: ${response.status}`,
            `X-Robots-Tag: ${xRobotsTag ?? 'Not present'}`,
          ].join('\n');
          break;
        }
        case 'sitemap-validator': {
          const xml = (form.sitemap ?? '').trim();
          const issues: string[] = [];
          const hasDeclaration = xml.startsWith('<?xml');
          const hasUrlSet = /<urlset[\s>]/i.test(xml);
          const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => (match[1] ?? '').trim());
          if (!hasDeclaration) {
            issues.push('Missing XML declaration.');
          }
          if (!hasUrlSet) {
            issues.push('Missing <urlset> root node.');
          }
          if (!urls.length) {
            issues.push('No <loc> URLs found.');
          }
          output = [
            `XML Declaration: ${hasDeclaration ? 'Present' : 'Missing'}`,
            `urlset Node: ${hasUrlSet ? 'Present' : 'Missing'}`,
            `URLs Found: ${urls.length}`,
            '',
            'Issues:',
            ...(issues.length ? issues.map((item) => `- ${item}`) : ['- None']),
          ].join('\n');
          break;
        }
        case 'sitemap-url-extractor': {
          const xml = form.sitemap ?? '';
          const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => (match[1] ?? '').trim()).filter(Boolean);
          output = [
            `Total URLs: ${urls.length}`,
            '',
            'URLs:',
            ...(urls.length ? urls.map((url) => `- ${url}`) : ['- None found']),
          ].join('\n');
          break;
        }
        case 'robots-tester': {
          const rules = parseList(form.robotsTxt ?? '');
          const url = new URL(normalizeUrl(form.testUrl ?? 'https://example.com'));
          const path = url.pathname || '/';
          const disallowRules = rules.filter((line) => /^disallow:/i.test(line)).map((line) => line.replace(/^disallow:\s*/i, '').trim());
          const allowRules = rules.filter((line) => /^allow:/i.test(line)).map((line) => line.replace(/^allow:\s*/i, '').trim());
          const blockedBy = disallowRules.find((rule) => rule && path.startsWith(rule));
          const allowedBy = allowRules.find((rule) => rule && path.startsWith(rule));
          const blocked = Boolean(blockedBy) && !allowedBy;
          output = [
            `Test URL: ${url.toString()}`,
            `Path: ${path}`,
            `Blocked: ${blocked ? 'Yes' : 'No'}`,
            `Matched Disallow: ${blockedBy ?? 'None'}`,
            `Matched Allow: ${allowedBy ?? 'None'}`,
          ].join('\n');
          break;
        }
        case 'serp-snippet-optimizer': {
          const title = (form.title ?? '').trim();
          const description = (form.description ?? '').trim();
          const url = normalizeUrl(form.url ?? 'https://example.com').replace(/^https?:\/\//, '');
          const titleStatus = title.length >= 40 && title.length <= 60 ? 'Ideal' : title.length < 40 ? 'Too short' : 'Too long';
          const descStatus = description.length >= 140 && description.length <= 160 ? 'Ideal' : description.length < 140 ? 'Too short' : 'Too long';
          output = [
            `Title Length: ${title.length} (${titleStatus})`,
            `Description Length: ${description.length} (${descStatus})`,
            '',
            'SERP Preview:',
            clip(title, 60),
            url,
            clip(description, 160),
          ].join('\n');
          break;
        }
        case 'keyword-suggestion-generator': {
          const keyword = (form.keyword ?? '').trim() || 'seo';
          const count = Math.max(1, Math.min(25, Math.round(getNumeric(form.count ?? '10', 10))));
          const modifiers = ['best', 'tools', 'guide', 'checklist', 'tips', 'strategy', 'template', 'services', 'examples', 'for beginners'];
          const suggestions = Array.from({ length: count }).map((_, index) => `${keyword} ${modifiers[index % modifiers.length]}`);
          output = [
            `Seed Keyword: ${keyword}`,
            `Suggestions: ${suggestions.length}`,
            '',
            'Keywords:',
            ...suggestions.map((item) => `- ${item}`),
          ].join('\n');
          break;
        }
        case 'long-tail-keyword-finder': {
          const keyword = (form.keyword ?? '').trim() || 'seo';
          const count = Math.max(1, Math.min(25, Math.round(getNumeric(form.count ?? '12', 12))));
          const patterns = [
            `how to ${keyword} for small business`,
            `${keyword} checklist for beginners`,
            `best ${keyword} strategy in 2026`,
            `${keyword} mistakes to avoid`,
            `${keyword} tools for startups`,
            `${keyword} step by step guide`,
          ];
          const suggestions = Array.from({ length: count }).map((_, index) => patterns[index % patterns.length]);
          output = [
            `Seed Keyword: ${keyword}`,
            `Long-tail Suggestions: ${suggestions.length}`,
            '',
            'Long-tail Keywords:',
            ...suggestions.map((item) => `- ${item}`),
          ].join('\n');
          break;
        }
        case 'keyword-difficulty-estimator': {
          const keyword = (form.keyword ?? '').trim() || 'seo keyword';
          const terms = keyword.split(/\s+/).filter(Boolean).length;
          const domainAuthority = Math.max(0, Math.min(100, getNumeric(form.domainAuthority ?? '45', 45)));
          let difficulty = 30 + (terms * 8) + (/\b(best|top|services|agency|buy)\b/i.test(keyword) ? 12 : 0);
          difficulty += Math.max(0, Math.round((60 - domainAuthority) / 2));
          difficulty = Math.max(1, Math.min(100, difficulty));
          const label = difficulty >= 70 ? 'High' : difficulty >= 45 ? 'Medium' : 'Low';
          output = [
            `Keyword: ${keyword}`,
            `Estimated Difficulty: ${difficulty}/100`,
            `Difficulty Level: ${label}`,
            `Domain Authority Used: ${domainAuthority}`,
          ].join('\n');
          break;
        }
        case 'search-intent-classifier': {
          const keyword = (form.keyword ?? '').trim() || 'seo';
          const intent = classifySearchIntent(keyword);
          output = [
            `Keyword: ${keyword}`,
            `Predicted Intent: ${intent}`,
          ].join('\n');
          break;
        }
        case 'faq-schema-generator': {
          const pairs = parsePipeRows(form.faqPairs ?? '').filter((row) => row.left && row.right);
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pairs.map((pair) => ({
              '@type': 'Question',
              name: pair.left,
              acceptedAnswer: {
                '@type': 'Answer',
                text: pair.right,
              },
            })),
          };
          output = JSON.stringify(schema, null, 2);
          break;
        }
        case 'product-schema-generator': {
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: form.name ?? '',
            description: form.description ?? '',
            brand: {
              '@type': 'Brand',
              name: form.brand ?? '',
            },
            sku: form.sku ?? '',
            offers: {
              '@type': 'Offer',
              url: form.url ?? '',
              priceCurrency: form.currency ?? 'USD',
              price: form.price ?? '',
              availability: form.availability ?? 'https://schema.org/InStock',
            },
          };
          output = JSON.stringify(schema, null, 2);
          break;
        }
        case 'article-schema-generator': {
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: form.headline ?? '',
            description: form.description ?? '',
            author: {
              '@type': 'Person',
              name: form.author ?? '',
            },
            datePublished: form.publishedDate ?? '',
            mainEntityOfPage: form.url ?? '',
          };
          output = JSON.stringify(schema, null, 2);
          break;
        }
        case 'local-business-schema-generator': {
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: form.name ?? '',
            telephone: form.phone ?? '',
            url: form.website ?? '',
            address: {
              '@type': 'PostalAddress',
              streetAddress: form.address ?? '',
              addressLocality: form.city ?? '',
              addressCountry: form.country ?? '',
            },
          };
          output = JSON.stringify(schema, null, 2);
          break;
        }
        case 'breadcrumb-schema-generator': {
          const rows = parsePipeRows(form.items ?? '').filter((row) => row.left && row.right);
          const schema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: rows.map((row, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: row.left,
              item: row.right,
            })),
          };
          output = JSON.stringify(schema, null, 2);
          break;
        }
        case 'internal-link-suggestor': {
          const report = findInternalLinkOpportunities({
            targetKeywords: form.targetKeywords ?? '',
            existingPages: form.existingPages ?? '',
          });
          output = [
            `Target Keywords with Matches: ${report.opportunities.length}`,
            `Unmatched Keywords: ${report.unmatchedKeywords.length}`,
            '',
            'Suggestions:',
            ...(
              report.opportunities.length
                ? report.opportunities.flatMap((item) => [
                  `- ${item.keyword}`,
                  ...item.matches.map((match) => `  - ${match.title} -> ${match.url}`),
                ])
                : ['- No match found']
            ),
          ].join('\n');
          break;
        }
        case 'anchor-text-analyzer': {
          const anchors = parseList(form.anchors ?? '');
          const genericTerms = new Set(['click here', 'read more', 'learn more', 'here', 'this link']);
          const targetKeyword = (form.targetKeyword ?? '').trim().toLowerCase();
          let exactMatch = 0;
          let generic = 0;
          anchors.forEach((anchor) => {
            const normalized = anchor.toLowerCase().trim();
            if (targetKeyword && normalized === targetKeyword) {
              exactMatch += 1;
            }
            if (genericTerms.has(normalized)) {
              generic += 1;
            }
          });
          output = [
            `Total Anchors: ${anchors.length}`,
            `Exact Match Anchors: ${exactMatch}`,
            `Generic Anchors: ${generic}`,
            '',
            'Recommendation:',
            generic > 0
              ? '- Reduce generic anchors and use descriptive context-based anchors.'
              : '- Anchor mix looks healthy.',
          ].join('\n');
          break;
        }
        case 'page-speed-hint-checker': {
          const lcp = getNumeric(form.lcp ?? '0', 0);
          const cls = getNumeric(form.cls ?? '0', 0);
          const inp = getNumeric(form.inp ?? '0', 0);
          const imageWeightKb = getNumeric(form.imageWeightKb ?? '0', 0);
          const jsWeightKb = getNumeric(form.jsWeightKb ?? '0', 0);
          const hints = [
            lcp > 2.5 && '- Improve LCP by optimizing hero image delivery and server response time.',
            cls > 0.1 && '- Reduce layout shift by reserving media dimensions and avoiding late UI injections.',
            inp > 200 && '- Reduce INP by splitting long JavaScript tasks and deferring non-critical scripts.',
            imageWeightKb > 1200 && '- Compress large images and adopt next-gen formats.',
            jsWeightKb > 700 && '- Reduce JS bundle size and remove unused dependencies.',
          ].filter(Boolean) as string[];
          output = [
            `LCP: ${lcp}s`,
            `CLS: ${cls}`,
            `INP: ${inp}ms`,
            `Image Weight: ${imageWeightKb}KB`,
            `JS Weight: ${jsWeightKb}KB`,
            '',
            'Optimization Hints:',
            ...(hints.length ? hints : ['- Metrics look healthy.']),
          ].join('\n');
          break;
        }
        case 'core-web-vitals-estimator': {
          const lcp = getNumeric(form.lcp ?? '0', 0);
          const cls = getNumeric(form.cls ?? '0', 0);
          const inp = getNumeric(form.inp ?? '0', 0);
          const lcpPass = lcp > 0 && lcp <= 2.5;
          const clsPass = cls >= 0 && cls <= 0.1;
          const inpPass = inp > 0 && inp <= 200;
          const passCount = [lcpPass, clsPass, inpPass].filter(Boolean).length;
          const overall = passCount === 3 ? 'Good' : passCount === 2 ? 'Needs Improvement' : 'Poor';
          output = [
            `LCP: ${lcp}s (${lcpPass ? 'Pass' : 'Fail'})`,
            `CLS: ${cls} (${clsPass ? 'Pass' : 'Fail'})`,
            `INP: ${inp}ms (${inpPass ? 'Pass' : 'Fail'})`,
            `Overall: ${overall}`,
          ].join('\n');
          break;
        }
        case 'mobile-friendly-checklist': {
          const viewport = (form.viewport ?? '').trim().toLowerCase();
          const responsive = (form.responsive ?? '').trim().toLowerCase();
          const tapTargets = (form.tapTargets ?? '').trim().toLowerCase();
          const fontSize = getNumeric(form.fontSize ?? '16', 16);
          const checks = [
            { label: 'Viewport Meta', pass: viewport === 'yes' },
            { label: 'Responsive Layout', pass: responsive === 'yes' },
            { label: 'Tap Target Spacing', pass: tapTargets === 'yes' },
            { label: 'Readable Font Size', pass: fontSize >= 14 },
          ];
          const passed = checks.filter((check) => check.pass).length;
          output = [
            `Checks Passed: ${passed}/${checks.length}`,
            '',
            'Checklist:',
            ...checks.map((check) => `- ${check.label}: ${check.pass ? 'Pass' : 'Fail'}`),
          ].join('\n');
          break;
        }
        case 'ssl-https-checker': {
          const requestedUrl = normalizeUrl(form.url ?? 'https://example.com');
          const response = await fetch(requestedUrl);
          const finalUrl = response.url;
          const httpsEnabled = finalUrl.startsWith('https://');
          const hsts = response.headers.get('strict-transport-security');
          output = [
            `Requested URL: ${requestedUrl}`,
            `Final URL: ${finalUrl}`,
            `HTTPS Enabled: ${httpsEnabled ? 'Yes' : 'No'}`,
            `HSTS Header: ${hsts ?? 'Not found'}`,
          ].join('\n');
          break;
        }
        case 'seo-title-idea-generator': {
          const report = generateSeoTitleIdeas({
            topic: form.topic ?? '',
            keyword: form.keyword ?? '',
            brand: form.brand ?? '',
            count: form.count ?? '',
          });
          output = [
            `Keyword: ${report.keyword}`,
            `Total Ideas: ${report.titles.length}`,
            '',
            'Title Ideas:',
            ...report.titles.map((row, index) => (
              `${index + 1}. ${row.title} (${row.length} chars${row.withinLimit ? ', ideal length' : ''})`
            )),
          ].join('\n');
          break;
        }
        case 'meta-description-idea-generator': {
          const report = generateMetaDescriptionIdeas({
            topic: form.topic ?? '',
            keyword: form.keyword ?? '',
            cta: form.cta ?? '',
            count: form.count ?? '',
          });
          output = [
            `Keyword: ${report.keyword}`,
            `Total Ideas: ${report.descriptions.length}`,
            '',
            'Meta Description Ideas:',
            ...report.descriptions.map((row, index) => (
              `${index + 1}. ${row.description} (${row.length} chars${row.withinRange ? ', in range' : ''})`
            )),
          ].join('\n');
          break;
        }
        case 'seo-slug-generator': {
          const report = generateSeoSlug({ title: form.title ?? '' });
          output = [
            `Slug: ${report.slug}`,
            `Length: ${report.length}`,
            '',
            'Notes:',
            ...(report.warnings.length ? report.warnings.map((item) => `- ${item}`) : ['- Slug looks good.']),
          ].join('\n');
          break;
        }
        case 'keyword-clusterer': {
          const report = clusterKeywords({ keywords: form.keywords ?? '' });
          output = [
            `Total Keywords: ${report.totalKeywords}`,
            `Clusters: ${report.clusters.length}`,
            '',
            'Grouped Keywords:',
            ...(
              report.clusters.length
                ? report.clusters.flatMap((cluster) => [
                  `- ${cluster.label} (${cluster.keywords.length})`,
                  ...cluster.keywords.map((keyword) => `  - ${keyword}`),
                ])
                : ['- No keywords found.']
            ),
          ].join('\n');
          break;
        }
        case 'keyword-intent-breakdown': {
          const report = buildKeywordIntentBreakdown({ keywords: form.keywords ?? '' });
          output = [
            `Total Keywords: ${report.rows.length}`,
            `Informational: ${report.totals.Informational}`,
            `Commercial: ${report.totals.Commercial}`,
            `Transactional: ${report.totals.Transactional}`,
            `Navigational: ${report.totals.Navigational}`,
            `Local: ${report.totals.Local}`,
            '',
            'Keyword Intent:',
            ...(report.rows.length ? report.rows.map((row) => `- ${row.keyword}: ${row.intent}`) : ['- No keywords found.']),
          ].join('\n');
          break;
        }
        case 'semantic-keyword-expander': {
          const report = expandSemanticKeywords({
            seedKeyword: form.seedKeyword ?? '',
            modifiers: form.modifiers ?? '',
            locations: form.locations ?? '',
          });
          output = [
            `Seed Keyword: ${report.seedKeyword}`,
            `Total Suggestions: ${report.suggestions.length}`,
            '',
            'Suggestions:',
            ...report.suggestions.map((keyword) => `- ${keyword}`),
          ].join('\n');
          break;
        }
        case 'seo-content-outline-generator': {
          const report = generateSeoContentOutline({
            topic: form.topic ?? '',
            primaryKeyword: form.primaryKeyword ?? '',
            audience: form.audience ?? '',
          });
          output = [
            `Suggested Title: ${report.title}`,
            `Meta Description: ${report.metaDescription}`,
            '',
            'Outline:',
            ...report.sections.flatMap((section) => [
              `- ${section.heading}`,
              ...section.points.map((point) => `  - ${point}`),
            ]),
            '',
            'FAQ Ideas:',
            ...report.faq.map((question) => `- ${question}`),
          ].join('\n');
          break;
        }
        case 'image-alt-text-helper': {
          const report = generateAltTextSuggestions({
            subject: form.subject ?? '',
            context: form.context ?? '',
            count: form.count ?? '',
          });
          output = [
            `Suggestions: ${report.suggestions.length}`,
            '',
            'Alt Text Ideas:',
            ...report.suggestions.map((item, index) => `${index + 1}. ${item.text} (${item.length} chars)`),
          ].join('\n');
          break;
        }
        case 'internal-link-opportunities': {
          const report = findInternalLinkOpportunities({
            targetKeywords: form.targetKeywords ?? '',
            existingPages: form.existingPages ?? '',
          });
          output = [
            `Target Keywords with Matches: ${report.opportunities.length}`,
            `Unmatched Keywords: ${report.unmatchedKeywords.length}`,
            `Ignored Page Lines: ${report.ignoredLines.length}`,
            '',
            'Internal Link Opportunities:',
            ...(
              report.opportunities.length
                ? report.opportunities.flatMap((opportunity) => [
                  `- ${opportunity.keyword} (anchor: ${opportunity.anchorText})`,
                  ...opportunity.matches.map((match) => `  - ${match.title} -> ${match.url} [score: ${match.score}]`),
                ])
                : ['- No strong matches found.']
            ),
            '',
            'Unmatched:',
            ...(report.unmatchedKeywords.length ? report.unmatchedKeywords.map((item) => `- ${item}`) : ['- None']),
            '',
            'Ignored Lines:',
            ...(report.ignoredLines.length ? report.ignoredLines.map((item) => `- ${item}`) : ['- None']),
          ].join('\n');
          break;
        }
        case 'on-page-seo-checklist': {
          const report = generateOnPageSeoChecklist({
            pageType: form.pageType ?? '',
            goal: form.goal ?? '',
          });
          output = [
            `Page Type: ${report.pageType}`,
            `Goal: ${report.goal}`,
            '',
            'Checklist:',
            ...report.sections.flatMap((section) => [
              `- ${section.heading}`,
              ...section.items.map((item) => `  - ${item}`),
            ]),
          ].join('\n');
          break;
        }
        case 'md5-generator':
          output = md5(form.text);
          break;
        default:
          output = 'Tool is not configured yet.';
      }

      setResult(output);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setResult(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: tool.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{tool.title}</Text>
          <Text style={styles.heroDesc}>{tool.desc}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Inputs</Text>
          {supportsImageUpload ? (
            <View style={styles.uploadWrap}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={loading}>
                <Text style={styles.uploadButtonText}>
                  {selectedImage ? 'Change Selected Image' : 'Select Image From Files'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButtonSecondary} onPress={pickImageFromGallery} disabled={loading}>
                <Text style={styles.uploadButtonSecondaryText}>Pick From Gallery</Text>
              </TouchableOpacity>
              {selectedImage ? (
                <View style={styles.selectedImageWrap}>
                  <ExpoImage source={selectedImage.uri} style={styles.selectedImage} contentFit="cover" />
                  <View style={styles.selectedMeta}>
                    <Text style={styles.selectedMetaTitle}>{selectedImage.fileName ?? 'Selected Image'}</Text>
                    <Text style={styles.selectedMetaText}>
                      {selectedImage.width}x{selectedImage.height}
                    </Text>
                    <Text style={styles.selectedMetaText}>
                      {selectedImage.fileSize ? `${formatSizeKb(selectedImage.fileSize)} KB` : 'Size unavailable'}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.helperText}>Select an image from device files before running this tool.</Text>
              )}
            </View>
          ) : null}

          {fields.length === 0 ? (
            <Text style={styles.helperText}>No input required for this tool.</Text>
          ) : (
            fields.map((field) => (
              <View key={field.key} style={styles.fieldWrap}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={[styles.input, field.multiline && styles.inputMultiline]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#9CA3AF"
                  value={form[field.key] ?? ''}
                  onChangeText={(value) => setValue(field.key, value)}
                  multiline={field.multiline}
                  keyboardType={field.keyboardType ?? 'default'}
                  autoCapitalize="none"
                  textAlignVertical={field.multiline ? 'top' : 'center'}
                />
              </View>
            ))
          )}

          <TouchableOpacity style={styles.button} onPress={runTool} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Run Tool</Text>}
          </TouchableOpacity>
        </View>

        {previewImages.length ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{previewTitle || 'Generated Preview'}</Text>
            <View style={styles.previewGrid}>
              {previewImages.map((item) => (
                <View key={`${item.label}-${item.uri}`} style={styles.previewCard}>
                  <ExpoImage source={item.uri} style={styles.previewImage} contentFit="contain" />
                  <Text style={styles.previewLabel}>{item.label}</Text>
                  {item.fileName ? <Text style={styles.previewMeta}>{item.fileName}</Text> : null}
                  {item.fileName && item.mimeType ? (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() =>
                        downloadAsset({
                          label: item.label,
                          uri: item.uri,
                          fileName: item.fileName ?? `${item.label}.png`,
                          mimeType: item.mimeType ?? 'image/png',
                        })
                      }
                    >
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Output</Text>
          <Text style={styles.outputText}>{result || 'Run the tool to see results here.'}</Text>
          {downloadAssets.length ? (
            <View style={styles.downloadList}>
              {downloadAssets.map((asset) => (
                <TouchableOpacity
                  key={`${asset.fileName}-${asset.uri}`}
                  style={styles.outputDownloadButton}
                  onPress={() => downloadAsset(asset)}
                >
                  <Text style={styles.outputDownloadButtonText}>{asset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FB',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
  },
  uploadWrap: {
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#111827',
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  uploadButtonSecondary: {
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  uploadButtonSecondaryText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedImageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  selectedImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  selectedMeta: {
    flex: 1,
  },
  selectedMetaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  selectedMetaText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputMultiline: {
    minHeight: 120,
  },
  button: {
    marginTop: 4,
    backgroundColor: '#6C5CE7',
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  previewMeta: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  downloadButton: {
    marginTop: 10,
    minHeight: 36,
    borderRadius: 10,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 12,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  outputText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
  },
  downloadList: {
    marginTop: 14,
    gap: 10,
  },
  outputDownloadButton: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  outputDownloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
