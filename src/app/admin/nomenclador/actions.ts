"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { AMBITOS, readNomencladorConfig } from "@/lib/nomenclador/config";
import { parseImporte, parsePlanilla, type PrestacionImportada } from "@/lib/nomenclador/planilla";
import type { ValoresUpe } from "@/lib/nomenclador/config";

export type EstadoNomenclador = { ok: boolean; mensaje: string };
export type RevisionNomenclador = EstadoNomenclador & {
  hojas?: string[]; hoja?: string; total?: number; muestra?: PrestacionImportada[];
  valoresUpe?: ValoresUpe | null; referencias?: number; errores?: string[];
};
async function requireSession() {
  if (!(await auth())?.user) throw new Error("Tu sesión venció. Volvé a ingresar al panel.");
}
function revalidateTodo() {
  revalidatePath("/nomenclador");
  revalidatePath("/admin/nomenclador");
}
async function readFile(formData: FormData) {
  const file = formData.get("archivo");
  if (!(file instanceof File) || !file.size) throw new Error("Seleccioná una planilla Excel o CSV.");
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) throw new Error("El archivo debe ser Excel (.xlsx o .xls) o CSV.");
  if (file.size > 10 * 1024 * 1024) throw new Error("La planilla no debe superar los 10 MB.");
  const result = parsePlanilla(new Uint8Array(await file.arrayBuffer()), file.name, String(formData.get("hoja") ?? "") || undefined);
  return { file, result };
}
async function readPdf(formData: FormData, required = false) {
  const pdf = formData.get("pdf");
  if (!(pdf instanceof File) || !pdf.size) {
    if (required) throw new Error("Seleccioná un PDF.");
    return null;
  }
  if (!/\.pdf$/i.test(pdf.name) || pdf.size > 10 * 1024 * 1024) throw new Error("El adjunto debe ser un PDF de hasta 10 MB.");
  const signature = new TextDecoder().decode(await pdf.slice(0, 5).arrayBuffer());
  if (signature !== "%PDF-") throw new Error("El archivo adjunto no es un PDF válido.");
  return pdf;
}
function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo completar la operación. Intentá nuevamente.";
}

export async function revisarPlanilla(formData: FormData): Promise<RevisionNomenclador> {
  await requireSession();
  try {
    const { result } = await readFile(formData);
    return {
      ok: !result.errores.length,
      mensaje: result.errores.length ? "La planilla necesita revisión. No se modificó el nomenclador." : `Se encontraron ${result.items.length} prestaciones listas para publicar.`,
      hojas: result.hojas, hoja: result.hoja, total: result.items.length, muestra: result.items.slice(0, 8),
      valoresUpe: result.valoresUpe, referencias: result.otrosValores.length, errores: result.errores.slice(0, 30),
    };
  } catch (error) { return { ok: false, mensaje: errorMessage(error) }; }
}

export async function publicarPlanilla(formData: FormData): Promise<EstadoNomenclador> {
  await requireSession();
  let input: Awaited<ReturnType<typeof readFile>>;
  let pdf: File | null;
  try {
    input = await readFile(formData);
    if (input.result.errores.length || !input.result.items.length) return { ok: false, mensaje: input.result.errores[0] ?? "No hay prestaciones para publicar." };
    pdf = await readPdf(formData);
  } catch (error) { return { ok: false, mensaje: errorMessage(error) }; }
  try {
    const pdfUrl = pdf ? await saveUploadedFile(pdf, "nomenclador") : null;
    await prisma.$transaction(async (tx) => {
      const registro = await tx.paginaTexto.findUnique({ where: { pagina: "nomenclador" } });
      const config = readNomencladorConfig(registro?.contenido);
      const contenido = {
        ...config,
        valoresUpe: input.result.valoresUpe ?? config.valoresUpe,
        otrosValores: input.result.otrosValores,
        archivoNombre: input.file.name, publicadoEn: new Date().toISOString(), pdfUrl,
      };
      await tx.nomencladorItem.deleteMany();
      await tx.nomencladorItem.createMany({ data: input.result.items });
      await tx.paginaTexto.upsert({ where: { pagina: "nomenclador" }, create: { pagina: "nomenclador", contenido }, update: { contenido } });
    });
    revalidateTodo();
    return { ok: true, mensaje: `Se publicaron ${input.result.items.length} prestaciones. El Excel descargable ya contiene estos valores.${pdf ? " El PDF también quedó actualizado." : " Podés adjuntar el PDF actualizado desde la sección de abajo."}` };
  } catch { return { ok: false, mensaje: "No se pudo publicar la planilla. El nomenclador anterior se conservó; intentá nuevamente." }; }
}

export async function guardarValoresUpe(formData: FormData): Promise<EstadoNomenclador> {
  await requireSession();
  const valoresUpe = {} as ValoresUpe;
  for (const { key, label } of AMBITOS) {
    const number = parseImporte(formData.get(key));
    if (number === null) return { ok: false, mensaje: `Ingresá un importe válido para ${label}.` };
    valoresUpe[key] = number;
  }
  try {
    await prisma.$transaction(async (tx) => {
      const registro = await tx.paginaTexto.findUnique({ where: { pagina: "nomenclador" } });
      const contenido = { ...readNomencladorConfig(registro?.contenido), valoresUpe };
      await tx.paginaTexto.upsert({ where: { pagina: "nomenclador" }, create: { pagina: "nomenclador", contenido }, update: { contenido } });
    });
    revalidateTodo();
    return { ok: true, mensaje: "Se guardaron los cuatro valores por UPE." };
  } catch { return { ok: false, mensaje: "No se pudieron guardar los valores. Intentá nuevamente." }; }
}

export async function guardarPdfNomenclador(formData: FormData): Promise<EstadoNomenclador> {
  await requireSession();
  let pdf: File | null;
  try { pdf = await readPdf(formData, true); }
  catch (error) { return { ok: false, mensaje: errorMessage(error) }; }
  try {
    const pdfUrl = await saveUploadedFile(pdf!, "nomenclador");
    await prisma.$transaction(async (tx) => {
      const registro = await tx.paginaTexto.findUnique({ where: { pagina: "nomenclador" } });
      const contenido = { ...readNomencladorConfig(registro?.contenido), pdfUrl };
      await tx.paginaTexto.upsert({ where: { pagina: "nomenclador" }, create: { pagina: "nomenclador", contenido }, update: { contenido } });
    });
    revalidateTodo();
    return { ok: true, mensaje: "El PDF ya está disponible para descargar." };
  } catch { return { ok: false, mensaje: "No se pudo guardar el PDF. Intentá nuevamente." }; }
}
