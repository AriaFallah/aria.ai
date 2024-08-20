import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import markdownIntegration from '@astropub/md';
import { visit } from 'unist-util-visit';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [rewriteLinks],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  integrations: [mdx(), markdownIntegration()],
  scopedStyleStrategy: 'class',
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  image: {
    domains: ['pub-4c968c1e5299430eafe672b417232afa.r2.dev'],
  },
});

function rewriteLinks() {
  return function (tree) {
    visit(tree, 'link', (node) => {
      const url = node.url;
      if (url.startsWith('http') && !url.includes('aria.ai')) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = '_blank';
        node.data.hProperties.rel = 'noopener noreferrer';
      } else if (!url.startsWith('#') && !url.endsWith('/')) {
        node.url += '/';
      }
    });
  };
}
