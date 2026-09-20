import { VALORES_UPE, OTROS_VALORES } from "@/components/nomenclador/data";

export const AMBITOS = [
  { key: "cd", label: "Consultorio Diurno (CD)" },
  { key: "cn", label: "Consultorio Nocturno (CN)" },
  { key: "dd", label: "Domicilio Diurno (DD)" },
  { key: "dn", label: "Domicilio Nocturno (DN)" },
] as const;
export type ValoresUpe = Record<(typeof AMBITOS)[number]["key"], number>;
export type Referencia = { concepto: string; valor: number };
export type NomencladorConfig = {
  valoresUpe: ValoresUpe;
  otrosValores: Referencia[];
  pdfUrl: string | null;
  archivoNombre: string | null;
  publicadoEn: string | null;
};
export const DEFAULT_CONFIG: NomencladorConfig = {
  valoresUpe: { cd: VALORES_UPE[0].valor, cn: VALORES_UPE[1].valor, dd: VALORES_UPE[2].valor, dn: VALORES_UPE[3].valor },
  otrosValores: OTROS_VALORES,
  pdfUrl: null, archivoNombre: null, publicadoEn: null,
};
export function readNomencladorConfig(value: unknown): NomencladorConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...DEFAULT_CONFIG };
  const data = value as Partial<NomencladorConfig>;
  const valoresUpe = { ...DEFAULT_CONFIG.valoresUpe };
  for (const { key } of AMBITOS) {
    const number = data.valoresUpe?.[key];
    if (typeof number === "number" && Number.isFinite(number) && number >= 0) valoresUpe[key] = number;
  }
  return {
    valoresUpe,
    otrosValores: Array.isArray(data.otrosValores) ? data.otrosValores.filter((r) => r && typeof r.concepto === "string" && typeof r.valor === "number" && Number.isFinite(r.valor) && r.valor >= 0) : DEFAULT_CONFIG.otrosValores,
    pdfUrl: typeof data.pdfUrl === "string" && data.pdfUrl.startsWith("/uploads/nomenclador/") ? data.pdfUrl : null,
    archivoNombre: typeof data.archivoNombre === "string" ? data.archivoNombre : null,
    publicadoEn: typeof data.publicadoEn === "string" ? data.publicadoEn : null,
  };
}
