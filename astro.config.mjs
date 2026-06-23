import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://angelaceremonies.com',
  integrations: [sitemap()],
  image: {
    domains: ['images.pexels.com'],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
