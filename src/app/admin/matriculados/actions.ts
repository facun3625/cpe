"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { NivelMatricula } from "@prisma/client";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function normalizarClave(clave: string) {
  return clave.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function detectarNivel(valor: string): NivelMatricula {
  const v = normalizarClave(valor);
  if (v.includes("lic")) return "LICENCIADO";
  if (v.includes("aux")) return "AUXILIAR";
  return "ENFERMERO";
}

export async function createMatriculado(formData: FormData) {
  await requireSession();

  const apellido = String(formData.get("apellido") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const matricula = String(formData.get("matricula") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "ENFERMERO") as NivelMatricula;

  if (!apellido || !nombre || !dni || !matricula) throw new Error("Todos los campos son obligatorios");

  await prisma.matriculado.create({ data: { apellido, nombre, dni, matricula, nivel } });

  revalidatePath("/matriculados");
  revalidatePath("/admin/matriculados");
  redirect("/admin/matriculados");
}

export async function updateMatriculado(id: string, formData: FormData) {
  await requireSession();

  const apellido = String(formData.get("apellido") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const matricula = String(formData.get("matricula") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "ENFERMERO") as NivelMatricula;

  if (!apellido || !nombre || !dni || !matricula) throw new Error("Todos los campos son obligatorios");

  await prisma.matriculado.update({ where: { id }, data: { apellido, nombre, dni, matricula, nivel } });

  revalidatePath("/matriculados");
  revalidatePath("/admin/matriculados");
  redirect("/admin/matriculados");
}

export async function deleteMatriculado(id: string) {
  await requireSession();
  await prisma.matriculado.delete({ where: { id } });
  revalidatePath("/matriculados");
  revalidatePath("/admin/matriculados");
}

export type ImportResultado = { creados: number; actualizados: number; omitidos: number; eliminados: number; errores: string[] };

export async function importarMatriculadosExcel(formData: FormData): Promise<ImportResultado> {
  await requireSession();

  const modo = String(formData.get("modo") ?? "agregar");
  const archivo = formData.get("archivo") as File | null;
  if (!archivo || archivo.size === 0) {
    return { creados: 0, actualizados: 0, omitidos: 0, eliminados: 0, errores: ["No se recibió ningún archivo."] };
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const esCsv = archivo.name.toLowerCase().endsWith(".csv");

  let libro: XLSX.WorkBook;
  try {
    libro = esCsv
      ? XLSX.read(buffer.toString("utf-8"), { type: "string" })
      : XLSX.read(buffer, { type: "buffer" });
  } catch {
    return {
      creados: 0,
      actualizados: 0,
      omitidos: 0,
      eliminados: 0,
      errores: ["No se pudo leer el archivo. Verificá que sea una planilla Excel (.xls/.xlsx) o CSV válida."],
    };
  }

  const hoja = libro.Sheets[libro.SheetNames[0]];
  if (!hoja) {
    return { creados: 0, actualizados: 0, omitidos: 0, eliminados: 0, errores: ["El archivo no tiene ninguna hoja con datos."] };
  }
  const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, { defval: "" });

  let creados = 0;
  let actualizados = 0;
  let omitidos = 0;
  const errores: string[] = [];
  const dnisDelArchivo = new Set<string>();

  const validos: { apellido: string; nombre: string; dni: string; matricula: string; nivel: NivelMatricula }[] = [];

  for (const [index, filaCruda] of filas.entries()) {
    const fila: Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(filaCruda)) fila[normalizarClave(clave)] = valor;

    const apellido = String(fila["apellido"] ?? "").trim();
    const nombre = String(fila["nombre"] ?? "").trim();
    const dni = String(fila["dni"] ?? "").trim();
    const matricula = String(fila["matricula"] ?? fila["matrícula"] ?? "").trim();
    const nivelTexto = String(fila["nivel"] ?? "").trim();

    if (!apellido || !nombre || !dni || !matricula) {
      omitidos++;
      errores.push(`Fila ${index + 2}: faltan datos obligatorios (apellido, nombre, DNI o matrícula).`);
      continue;
    }

    const nivel = detectarNivel(nivelTexto);
    dnisDelArchivo.add(dni);

    validos.push({ apellido, nombre, dni, matricula, nivel });
  }

  // Validar el archivo completo antes de modificar o borrar el padrón.
  if (modo === "reemplazar" && (errores.length > 0 || validos.length === 0)) {
    return {
      creados: 0, actualizados: 0, omitidos, eliminados: 0,
      errores: ["No se reemplazó el padrón. Corregí las filas incompletas y verificá que el archivo tenga datos válidos.", ...errores.slice(0, 19)],
    };
  }

  const eliminados = await prisma.$transaction(async (tx) => {
    for (const { dni, ...data } of validos) {
      const existente = await tx.matriculado.findUnique({ where: { dni } });
      await tx.matriculado.upsert({ where: { dni }, update: data, create: { dni, ...data } });
      if (existente) actualizados++;
      else creados++;
    }
    if (modo === "reemplazar") {
      const { count } = await tx.matriculado.deleteMany({ where: { dni: { notIn: Array.from(dnisDelArchivo) } } });
      return count;
    }
    return 0;
  }, { timeout: 120_000 });

  revalidatePath("/matriculados");
  revalidatePath("/admin/matriculados");

  return { creados, actualizados, omitidos, eliminados, errores: errores.slice(0, 20) };
}
