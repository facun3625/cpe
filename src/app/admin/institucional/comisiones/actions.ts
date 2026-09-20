"use server";

import { readRichText, richTextLines } from "@/lib/rich-text";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function lineas(valor: FormDataEntryValue | null) {
  return richTextLines(valor);
}

function revalidateTodo() {
  revalidatePath("/institucional/comisiones");
  revalidatePath("/admin/institucional/comisiones");
}

export async function createComision(formData: FormData) {
  await requireSession();

  const titulo = readRichText(formData.get("titulo"));
  const texto = readRichText(formData.get("texto"));
  const tramitesRelacionados = lineas(formData.get("tramitesRelacionados"));
  const orden = Number(formData.get("orden") ?? 0);

  if (!titulo || !texto) throw new Error("Título y texto son obligatorios");

  await prisma.comision.create({ data: { titulo, texto, tramitesRelacionados, orden } });

  revalidateTodo();
  redirect("/admin/institucional/comisiones");
}

export async function updateComision(id: string, formData: FormData) {
  await requireSession();

  const titulo = readRichText(formData.get("titulo"));
  const texto = readRichText(formData.get("texto"));
  const tramitesRelacionados = lineas(formData.get("tramitesRelacionados"));
  const orden = Number(formData.get("orden") ?? 0);

  if (!titulo || !texto) throw new Error("Título y texto son obligatorios");

  await prisma.comision.update({ where: { id }, data: { titulo, texto, tramitesRelacionados, orden } });

  revalidateTodo();
  redirect("/admin/institucional/comisiones");
}

export async function deleteComision(id: string) {
  await requireSession();
  await prisma.comision.delete({ where: { id } });
  revalidateTodo();
}
