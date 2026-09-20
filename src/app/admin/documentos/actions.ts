"use server";

import { readRichText } from "@/lib/rich-text";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/upload";
import type { DocumentoTipo } from "@prisma/client";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function revalidateTodo() {
  revalidatePath("/admin/documentos");
  revalidatePath("/dictamenes");
  revalidatePath("/institucional/reglamentos");
  revalidatePath("/tramites");
  revalidatePath("/becas");
}

export async function createDocumento(formData: FormData) {
  await requireSession();

  const titulo = readRichText(formData.get("titulo"));
  const tipo = String(formData.get("tipo") ?? "") as DocumentoTipo;
  const grupo = String(formData.get("grupo") ?? "").trim();
  const noReconocida = formData.get("noReconocida") === "on";
  const archivo = formData.get("archivo") as File | null;

  if (!titulo || !tipo) throw new Error("Título y tipo son obligatorios");

  const archivoUrl = archivo && archivo.size > 0 ? await saveUploadedFile(archivo, "documentos") : null;

  await prisma.documento.create({
    data: { titulo, tipo, grupo: grupo || null, noReconocida, archivoUrl },
  });

  revalidateTodo();
  redirect("/admin/documentos");
}

export async function updateDocumento(id: string, formData: FormData) {
  await requireSession();

  const titulo = readRichText(formData.get("titulo"));
  const tipo = String(formData.get("tipo") ?? "") as DocumentoTipo;
  const grupo = String(formData.get("grupo") ?? "").trim();
  const noReconocida = formData.get("noReconocida") === "on";
  const archivo = formData.get("archivo") as File | null;

  if (!titulo || !tipo) throw new Error("Título y tipo son obligatorios");

  const data: { titulo: string; tipo: DocumentoTipo; grupo: string | null; noReconocida: boolean; archivoUrl?: string } = {
    titulo,
    tipo,
    grupo: grupo || null,
    noReconocida,
  };
  if (archivo && archivo.size > 0) {
    data.archivoUrl = await saveUploadedFile(archivo, "documentos");
  }

  await prisma.documento.update({ where: { id }, data });

  revalidateTodo();
  redirect("/admin/documentos");
}

export async function deleteDocumento(id: string) {
  await requireSession();
  await prisma.documento.delete({ where: { id } });
  revalidateTodo();
}
