export default {
  content: ['./template/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
};
