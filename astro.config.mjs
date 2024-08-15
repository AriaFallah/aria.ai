import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import markdownIntegration from '@astropub/md';

export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  integrations: [mdx(), markdownIntegration()],
  scopedStyleStrategy: 'class',
});
