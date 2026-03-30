import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mcpservers.dev',
  srcDir: './template/src',
  integrations: [tailwind(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  vite: {
    resolve: {
      alias: {
        '../../blog.config.ts': new URL('./blog.config.ts', import.meta.url).pathname,
        '../../../blog.config.ts': new URL('./blog.config.ts', import.meta.url).pathname,
      }
    }
  }
});
