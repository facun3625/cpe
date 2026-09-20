import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${process.env.BASE_URL ?? 'http://localhost:3108'}/nomenclador`);
  await page.getByRole('heading', { name: 'Nomenclador de prestaciones.' }).waitFor();
  const close = page.getByRole('button', { name: 'Cerrar', exact: true });
  if (await close.isVisible()) await close.click();
  const count = Number((await page.getByText(/^\d+ prestaciones?$/).textContent()).trim().split(' ')[0]);
  assert.ok(count > 0, 'La página debe mostrar las prestaciones existentes');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descargar Excel ↓' }).click();
  const download = await downloaded;
  assert.equal(download.suggestedFilename(), 'Aranceles.xlsx');
  const bytes = await readFile(await download.path());
  const book = XLSX.read(bytes, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(book.Sheets.Aranceles, { header: 1, raw: true });
  assert.equal(rows.filter(row => typeof row[2] === 'number').length, count);
  assert.deepEqual(rows[1].slice(3, 7), ['C.D.', 'C.N.', 'D.D.', 'D.N.']);
  await page.getByPlaceholder('Buscá una prestación: curación, medicación, sonda, vía intravenosa…').fill('curación');
  assert.ok(Number((await page.getByText(/^\d+ prestaciones?$/).textContent()).trim().split(' ')[0]) < count);
  await page.setViewportSize({ width: 375, height: 812 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Sin desborde horizontal en móvil');
  assert.deepEqual(errors, []);
  console.log(`OK: página pública, búsqueda, móvil y Excel con ${count} prestaciones y cuatro precios. No se modificaron datos.`);
} finally { await browser.close(); }
