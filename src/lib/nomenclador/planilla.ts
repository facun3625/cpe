import * as XLSX from "xlsx";
import { plainText } from "@/lib/rich-text";
import type { ValoresUpe, Referencia, NomencladorConfig } from "./config";

export type PrestacionImportada = {
  nombre: string; tiempo: string; upe: number; cd: number; cn: number; dd: number; dn: number;
  noReconocida: boolean; orden: number;
};
export type PlanillaResultado = {
  hoja: string; hojas: string[]; items: PrestacionImportada[]; valoresUpe: ValoresUpe | null;
  otrosValores: Referencia[]; errores: string[];
};
const normalizar = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function parseImporte(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) && value >= 0 && value <= 1e9 ? Math.round(value * 100) / 100 : null;
  const raw = String(value ?? "").replace(/ARS/gi, "").replace(/[$\s\u00a0]/g, "");
  if (!raw) return null;
  let canonical: string;
  if (raw.includes(",")) {
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+),\d{1,2}$/.test(raw)) return null;
    canonical = raw.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(?:\.\d{3})+$/.test(raw)) canonical = raw.replace(/\./g, "");
  else if (/^\d+(?:\.\d{1,2})?$/.test(raw)) canonical = raw;
  else return null;
  const number = Number(canonical);
  return number <= 1e9 ? Math.round(number * 100) / 100 : null;
}

function rowsOf(sheet: XLSX.WorkSheet): unknown[][] {
  if (!sheet["!ref"]) return [];
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  if (range.e.r > 20000 || range.e.c > 100) throw new Error("La hoja excede el máximo de 20.000 filas o 100 columnas.");
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: true });
}
function headerOf(rows: unknown[][]) {
  return rows.findIndex((row, index) => index < 60 && row.some((v) => ["actividad", "prestacion", "nombre", "practica"].includes(normalizar(v))) && row.some((v) => ["tiempo", "minutos"].includes(normalizar(v))));
}

export function parsePlanilla(bytes: Uint8Array, filename: string, hoja?: string): PlanillaResultado {
  const csv = /\.csv$/i.test(filename);
  const book = csv
    ? XLSX.read(new TextDecoder("utf-8").decode(bytes), { type: "string", raw: true })
    : XLSX.read(bytes, { type: "array", cellDates: false });
  if (book.SheetNames.length > 50) throw new Error("El archivo tiene demasiadas hojas. Subí únicamente la versión que querés publicar.");
  const candidates = book.SheetNames.filter((name) => headerOf(rowsOf(book.Sheets[name])) >= 0);
  const selected = hoja || (candidates.length === 1 ? candidates[0] : "");
  const result: PlanillaResultado = { hoja: selected, hojas: candidates, items: [], valoresUpe: null, otrosValores: [], errores: [] };
  if (!candidates.length) {
    result.errores.push("No se encontró la tabla de prestaciones. Elegí la hoja con Actividad, Tiempo, Cant./UPE, CD, CN, DD y DN; las tablas de valor hora no reemplazan el nomenclador.");
    return result;
  }
  if (!candidates.includes(selected)) {
    result.errores.push(candidates.length > 1 ? "El archivo contiene varias versiones. Seleccioná la hoja que querés publicar y revisala." : "La hoja seleccionada no contiene una tabla de prestaciones.");
    return result;
  }
  const rows = rowsOf(book.Sheets[selected]);
  const header = headerOf(rows);
  const names = rows[header].map(normalizar);
  const prior = (rows[header - 1] ?? []).map(normalizar);
  const find = (aliases: string[]) => names.findIndex((v) => aliases.includes(v));
  const nameIndex = find(["actividad", "prestacion", "nombre", "practica"]);
  const timeIndex = find(["tiempo", "minutos"]);
  const upeIndex = find(["cant", "cantidad", "upe", "cantidadupe"]);
  const priceIndex = (aliases: string[]) => { const direct = find(aliases); return direct >= 0 ? direct : prior.findIndex((v) => aliases.includes(v)); };
  const columns = {
    cd: priceIndex(["cd", "consultoriodiurno"]),
    cn: priceIndex(["cn", "cndd", "consultorionocturno"]),
    dd: priceIndex(["dd", "cndd", "domiciliodiurno"]),
    dn: priceIndex(["dn", "domicilionocturno"]),
  };
  if (upeIndex < 0 || Object.values(columns).some((v) => v < 0)) {
    result.errores.push("Faltan columnas: se necesitan Cant./UPE y los cuatro precios CD, CN, DD y DN (también se acepta CN/DD compartido).");
    return result;
  }
  const priceKeys = ["cd", "cn", "dd", "dn"] as const;
  const headerPrices = priceKeys.map((key) => parseImporte(rows[header][columns[key]]));
  if (headerPrices.every((v) => v !== null)) result.valoresUpe = Object.fromEntries(priceKeys.map((key, i) => [key, headerPrices[i]])) as ValoresUpe;
  const flagIndex = priceIndex(["noreconocida", "nocorresponde"]);
  const seen = new Set<string>();
  for (let index = header + 1; index < rows.length; index++) {
    const row = rows[index];
    if (row.every((v) => String(v).trim() === "")) continue;
    const nameRaw = String(row[nameIndex] ?? "").trim();
    const name = nameRaw.replace(/\s*\*+\s*$/, "").replace(/\s+/g, " ").trim();
    const time = String(row[timeIndex] ?? "").trim();
    const upeRaw = row[upeIndex];
    const prices = priceKeys.map((key) => parseImporte(row[columns[key]]));
    // Explicit footnotes are not activities. Unknown/incomplete rows remain errors.
    if (/^(\*?\s*(no incluye insumos|estas practicas)|[cCdD]\.?[dDnN]\.?:)/i.test(nameRaw)) continue;
    if (!time && !String(upeRaw ?? "").trim() && /^(auditor[ií]a|cobertura|peritos?)/i.test(name)) {
      const available = prices.filter((v) => v !== null);
      if (available.length === 1) result.otrosValores.push({ concepto: name, valor: available[0] });
      else result.errores.push(`Fila ${index + 1}: el valor de referencia «${name}» debe tener un único importe.`);
      continue;
    }
    const upe = parseImporte(upeRaw);
    if (!name || !time || upe === null || !Number.isInteger(upe) || upe <= 0 || prices.some((v) => v === null)) {
      result.errores.push(`Fila ${index + 1}: revisá actividad, tiempo, UPE entero positivo y los cuatro importes. No se aceptan celdas vacías, negativas o con errores.`);
      continue;
    }
    const key = normalizar(name);
    if (seen.has(key)) { result.errores.push(`Fila ${index + 1}: la prestación «${name}» está repetida.`); continue; }
    seen.add(key);
    result.items.push({ nombre: name, tiempo: time, upe, cd: prices[0]!, cn: prices[1]!, dd: prices[2]!, dn: prices[3]!, noReconocida: /\*\s*$/.test(nameRaw) || ["si", "true", "1"].includes(normalizar(row[flagIndex])), orden: result.items.length });
  }
  if (!result.items.length) result.errores.push("La tabla no contiene prestaciones válidas.");
  return result;
}

export function exportPlanilla(items: (Omit<PrestacionImportada, "dd" | "orden"> & { dd?: number | null })[], config: NomencladorConfig) {
  const { cd, cn, dd, dn } = config.valoresUpe;
  const rows: (string | number)[][] = [
    ["ARANCELES SUGERIDOS PARA LAS PRESTACIONES DE ENFERMERÍA"],
    ["", "UPE", "", "C.D.", "C.N.", "D.D.", "D.N.", "No reconocida"],
    ["Actividad", "Tiempo", "Cant.", cd, cn, dd, dn],
    ...items.map((item) => [plainText(item.nombre), item.tiempo, item.upe, item.cd, item.cn, item.dd ?? item.cn, item.dn, item.noReconocida ? "Sí" : "No"]),
    [],
    ...config.otrosValores.map((r) => [r.concepto, "", "", "", "", "", r.valor]),
    ["NO INCLUYE INSUMOS"],
  ];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [{ wch: 65 }, { wch: 12 }, { wch: 10 }, ...Array.from({ length: 4 }, () => ({ wch: 18 })), { wch: 18 }];
  for (let r = 2; r < rows.length; r++) for (let c = 3; c <= 6; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c })];
    if (cell?.t === "n") cell.z = '"$" #,##0.00';
  }
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Aranceles");
  return XLSX.write(book, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
