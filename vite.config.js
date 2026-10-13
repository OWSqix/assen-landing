import { defineConfig } from 'vite';

// Inline the page's single CSS bundle into index.html as a <style> block instead of a
// render-blocking <link> (static one-page site, LCP-sensitive). The emitted .css file is
// dropped from the bundle so only the HTML carries the styles.
const inlineCss = () => ({
  name: 'assen:inline-css',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const bundle = ctx.bundle;
      if (!bundle) return html;
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== 'asset' || !fileName.endsWith('.css')) continue;
        const linkTag = new RegExp(`<link rel="stylesheet"[^>]*href="/${fileName}"[^>]*>`);
        if (!linkTag.test(html)) continue;
        html = html.replace(linkTag, () => `<style>${asset.source}</style>`);
        delete bundle[fileName];
      }
      return html;
    },
  },
});

export default defineConfig({
  plugins: [inlineCss()],
});
