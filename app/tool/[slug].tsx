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
    buildKeywordDensity,
    buildUtmUrl,
    checkBrokenLinks,
    checkPlagiarism,
    checkServerStatus,
    countWords,
    estimateDomainAuthority,
    formatJson,
    generateBlogDraft,
    generateMetaTags,
    generateRobotsTxt,
    generateSitemapXml,
    getPublicIp,
    inspectBacklinks,
    md5,
    minifyCss,
    minifyJs,
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
                          mimeType: item.mimeType,
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
