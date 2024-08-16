import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import markdownIntegration from '@astropub/md';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkExternalLinks],
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
});

function remarkExternalLinks() {
  return function (tree) {
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'paragraph') {
        for (let j = 0; j < node.children.length; j++) {
          const child = node.children[j];
          if (
            child.type === 'link' &&
            child.url.startsWith('http') &&
            !child.url.includes('aria.ai')
          ) {
            child.data = child.data || {};
            child.data.hProperties = child.data.hProperties || {};
            child.data.hProperties.target = '_blank';
            child.data.hProperties.rel = 'noreferrer';
          }
        }
      }
    }
  };
}
