import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import * as XLSX from "xlsx";
import { parseImporte, parsePlanilla, exportPlanilla } from "../src/lib/nomenclador/planilla";
import { DEFAULT_CONFIG } from "../src/lib/nomenclador/config";

const fixture = readFileSync("public/ARANCELES/Aranceles Enero 2024-Tabla 1.csv");
const minimal = (rows: unknown[][]) => {
  const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(rows), "Aranceles");
  return XLSX.write(book, { type: "buffer", bookType: "xlsx" });
};
const header = ["Actividad", "Tiempo", "UPE", "CD", "CN", "DD", "DN"];

test("importa las cinco planillas ARANCELES completas sin confundir notas y valores de referencia", () => {
  for (const name of readdirSync("public/ARANCELES").filter((name) => name.startsWith("Aranceles "))) {
    const result = parsePlanilla(readFileSync(`public/ARANCELES/${name}`), name);
    assert.deepEqual(result.errores, [], name);
    assert.equal(result.items.length, 122, name);
    assert.equal(result.otrosValores.length, 3, name);
    assert.ok(result.valoresUpe, name);
  }
  const result = parsePlanilla(fixture, "enero.csv");
  assert.deepEqual(result.valoresUpe, { cd: 281.29, cn: 406.28, dd: 406.28, dn: 484.46 });
  assert.deepEqual([result.items[0].cd, result.items[0].cn, result.items[0].dd, result.items[0].dn], [5625.8, 8125.6, 8125.6, 9689.2]);
  assert.equal(result.items.filter((item) => item.noReconocida).length, 2);
});

test("rechaza hojas auxiliares, archivos vacíos, filas incompletas y duplicadas", () => {
  for (const name of readdirSync("public/ARANCELES").filter((name) => !name.startsWith("Aranceles "))) {
    assert.ok(parsePlanilla(readFileSync(`public/ARANCELES/${name}`), name).errores.length, name);
  }
  assert.ok(parsePlanilla(minimal([header, ["Actividad A", "6'", 2, 10, 20, "", 40]]), "test.xlsx").errores.length);
  assert.ok(parsePlanilla(minimal([header, ["Actividad A", "6'", 2, 10, 20, 30, 40], ["Actividad A", "6'", 2, 10, 20, 30, 40]]), "test.xlsx").errores.some((e) => e.includes("repetida")));
});

test("conserva CN y DD diferentes y admite encabezados equivalentes", () => {
  const result = parsePlanilla(minimal([header, ["Prueba", "6'", 2, "$ 1.000,50", "2000.25", 3000, 4000]]), "test.xlsx");
  assert.deepEqual(result.errores, []);
  assert.equal(result.items[0].cd, 1000.5);
  assert.equal(result.items[0].cn, 2000.25);
  assert.equal(result.items[0].dd, 3000);
});

test("el Excel descargado puede volver a importarse conservando precios, UPE, referencias y marcas", () => {
  const source = parsePlanilla(fixture, "test.csv");
  source.items[0].dd = 9999.99;
  const config = { ...DEFAULT_CONFIG, valoresUpe: source.valoresUpe!, otrosValores: source.otrosValores };
  const result = parsePlanilla(exportPlanilla(source.items, config), "descarga.xlsx");
  assert.deepEqual(result.errores, []);
  assert.deepEqual(result.items, source.items);
  assert.deepEqual(result.valoresUpe, source.valoresUpe);
  assert.deepEqual(result.otrosValores, source.otrosValores);
});

test("no mezcla versiones de distintas hojas", () => {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([header, ["Enero", "6'", 2, 10, 20, 30, 40]]), "Enero");
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([header, ["Febrero", "6'", 2, 20, 30, 40, 50]]), "Febrero");
  const bytes = XLSX.write(book, { type: "buffer", bookType: "xlsx" });
  assert.ok(parsePlanilla(bytes, "versiones.xlsx").errores.length);
  const selected = parsePlanilla(bytes, "versiones.xlsx", "Febrero");
  assert.deepEqual(selected.errores, []);
  assert.equal(selected.items.length, 1);
  assert.equal(selected.items[0].nombre, "Febrero");
});

test("importes inválidos nunca se convierten silenciosamente a cero", () => {
  for (const value of ["", " ", "#VALUE!", "-20", "1,2,3", "20 pesos", Infinity, NaN]) assert.equal(parseImporte(value), null);
  assert.equal(parseImporte("$ 5.625,80"), 5625.8);
  assert.equal(parseImporte("$ 1557.27"), 1557.27);
  assert.equal(parseImporte(0), 0);
});
