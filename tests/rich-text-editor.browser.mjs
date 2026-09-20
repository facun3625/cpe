import { build } from 'esbuild';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const bundle = await build({
  stdin: { contents: `
    import React, { useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { RichTextEditor } from './src/components/admin/rich-text-editor';
    import { RichText } from './src/components/rich-text';
    import { readRichText } from './src/lib/rich-text';
    function App() {
      const [saved, setSaved] = useState('');
      const [version, setVersion] = useState(0);
      return <main style={{maxWidth: 700, margin: 'auto'}}>
        <form onSubmit={e => { e.preventDefault(); setSaved(readRichText(new FormData(e.currentTarget).get('contenido'))); }}>
          <RichTextEditor key={version} name="contenido" defaultValue={saved || 'Hola mundo'} required />
          <button type="submit">Guardar prueba</button>
        </form>
        <button onClick={() => setVersion(v => v + 1)}>Volver a editar</button>
        <output id="preview"><RichText value={saved} /></output>
      </main>;
    }
    createRoot(document.getElementById('root')).render(<App />);
  `, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, platform: 'browser', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"development"' },
});
const { css: sharedCss } = await postcss([tailwind()]).process(readFileSync('src/app/globals.css', 'utf8'), { from: 'src/app/globals.css' });
const server = createServer((req, res) => {
  if (req.url === '/bundle.js') { res.setHeader('Content-Type', 'application/javascript'); res.end(bundle.outputFiles[0].text); }
  else { res.setHeader('Content-Type', 'text/html'); res.end(`<html><head><style>${sharedCss}</style></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>`); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const editor = page.locator('[contenteditable="true"]');
  await editor.waitFor();
  await editor.evaluate(element => {
    const node = element.querySelector('p').firstChild;
    const range = document.createRange(); range.setStart(node, 5); range.setEnd(node, 10);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    element.focus();
  });
  await page.getByRole('button', {name: 'Negrita', exact: true}).click();
  await page.getByRole('combobox', {name: 'Tamaño de texto'}).selectOption('24px');
  await page.getByLabel('Color de texto', {exact:true}).fill('#ff0000');
  await page.getByRole('combobox', {name: 'Alineación', exact:true}).selectOption('center');
  await page.getByRole('button', {name: 'Enlace', exact:true}).click();
  await page.getByLabel('Destino del enlace', {exact:true}).fill('https://example.com');
  await page.getByRole('button', {name: 'Aplicar enlace', exact:true}).click();
  await page.getByRole('button', {name: 'Guardar prueba'}).click();
  const preview = page.locator('#preview');
  await page.waitForFunction(() => document.querySelector('#preview a')?.textContent === 'mundo');
  assert.equal(await preview.locator('strong').textContent(), 'mundo');
  assert.equal(await preview.locator('a').getAttribute('href'), 'https://example.com');
  assert.equal(await preview.locator('[style*="color"]').evaluate(el => getComputedStyle(el).color), 'rgb(255, 0, 0)');
  assert.equal(await preview.locator('[style*="font-size"]').evaluate(el => getComputedStyle(el).fontSize), '24px');
  assert.equal(await preview.locator('.rich-text-paragraph').evaluate(el => getComputedStyle(el).textAlign), 'center');
  await page.getByRole('button', {name:'Volver a editar'}).click();
  await page.waitForFunction(() => document.querySelector('[contenteditable] strong')?.textContent === 'mundo');
  assert.equal(await editor.locator('a').getAttribute('href'), 'https://example.com');
  await page.setViewportSize({width:375,height:812});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  // Required validation rejects empty formatting-only content.
  await editor.click();
  await editor.press('ControlOrMeta+A');
  await editor.press('Backspace');
  await page.waitForFunction(() => document.querySelector('textarea').value === '');
  await page.getByRole('button', {name:'Guardar prueba'}).click();
  await page.getByRole('alert').waitFor({timeout:3000});
  assert.equal(await preview.locator('strong').textContent(), 'mundo');
  assert.deepEqual(errors, []);
  console.log('OK: selección parcial, negrita, tamaño, color, alineación, enlace, guardado, reedición, móvil y campo obligatorio.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
