// Build step 3/3: write the rendered page into dist/index.html so content, SEO crawlers and
// first paint don't wait on JavaScript. main.js sees data-prerendered and skips its own render.
//
// Runs after `vite build` (client → dist/) and `vite build --ssr src/render.js` (→ .ssr/),
// so image imports inside render.js resolve to the same hashed /assets/ URLs as the client.
import { readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const ssrDir = new URL('.ssr/', root);
const indexFile = new URL('dist/index.html', root);

const { renderApp } = await import(new URL('render.js', ssrDir));

const html = await readFile(indexFile, 'utf8');
const placeholder = '<div id="app"></div>';
if (!html.includes(placeholder)) {
  throw new Error(`prerender: ${placeholder} not found in dist/index.html`);
}

const prerendered = html.replace(
  placeholder,
  () => `<div id="app" data-prerendered="true">\n${renderApp()}\n  </div>`,
);
await writeFile(indexFile, prerendered);
await rm(ssrDir, { recursive: true, force: true });

console.log('prerender: dist/index.html written');
