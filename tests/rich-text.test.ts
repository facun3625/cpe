import test from "node:test";
import assert from "node:assert/strict";
import { richTextHtml, richTextInlineHtml, readRichText, plainText, richTextLines, joinRichTextLines, safeLink } from "../src/lib/rich-text";

test("preserva estilos seleccionados y enlaces seguros al guardar", () => {
  const value = '<p style="text-align: center">Hola <strong><span style="color: #ff0000; font-size: 24px">mundo</span></strong> <a href="https://example.com">Enlace</a></p>';
  const saved = readRichText(value);
  assert.match(saved, /font-size:24px/);
  assert.match(saved, /color:#ff0000/);
  assert.match(saved, /text-align:center/);
  assert.match(saved, /rel="noopener noreferrer"/);
  assert.equal(plainText(saved), "Hola mundo Enlace");
  assert.equal(richTextHtml(saved), saved);
});
test("elimina scripts, eventos, CSS inseguro y protocolos ejecutables", () => {
  const value = '<p onclick="alert(1)" style="position:fixed;color:#ff0000;background:url(javascript:alert(1))">Texto<script>alert(1)</script><img src=x onerror=alert(1)><a href="java&#x73;cript:alert(1)">link</a></p>';
  const html = readRichText(value);
  assert.doesNotMatch(html, /script|onclick|onerror|position|background|<img/i);
  assert.equal(plainText(html), "Textolink");
});
test("mantiene texto anterior, acentos, entidades y saltos de línea", () => {
  const value = 'Enfermería & salud\nSegundo párrafo < 3';
  assert.equal(plainText(richTextHtml(value)), value);
  assert.equal(readRichText(value), value);
  assert.equal(readRichText('<p><br></p>'), '');
});
test("listas conservan cada párrafo con estilos al guardar y volver a editar", () => {
  const html = '<p><strong>Primero</strong></p><p style="text-align:right"><a href="/tramites">Segundo</a></p>';
  const lines = richTextLines(html);
  assert.equal(lines.length, 2);
  assert.deepEqual(lines.map(plainText), ['Primero', 'Segundo']);
  assert.deepEqual(richTextLines(joinRichTextLines(lines)), lines);
  assert.deepEqual(richTextLines('Primero\n\nSegundo'), ['Primero', 'Segundo']);
});
test("el renderizado dentro de títulos no introduce párrafos ni anidamientos inválidos", () => {
  const html = richTextInlineHtml('<p style="text-align:right"><strong>Texto</strong></p>');
  assert.doesNotMatch(html, /<p[ >]/);
  assert.match(html, /class="rich-text-paragraph"/);
  assert.match(html, /text-align:right/);
});
test("valida destinos de enlaces", () => {
  for (const value of ['https://example.com', '/tramites', '#requisitos', 'mailto:info@example.com', 'tel:+54342123456']) assert.equal(safeLink(value), value);
  for (const value of ['javascript:alert(1)', 'data:text/html,a', '//example.com', '/\\example.com', 'java\nscript:alert(1)']) assert.equal(safeLink(value), null);
});
