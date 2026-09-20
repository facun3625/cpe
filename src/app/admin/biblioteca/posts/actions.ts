"use server";

import { readRichText } from "@/lib/rich-text";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/upload";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function revalidateTodo() {
  revalidatePath("/admin/biblioteca/posts");
  revalidatePath("/biblioteca");
}

export async function createPost(formData: FormData) {
  await requireSession();

  const categoriaId = String(formData.get("categoriaId") ?? "").trim();
  const titulo = readRichText(formData.get("titulo"));
  const bajada = readRichText(formData.get("bajada"));
  const publicado = formData.get("publicado") === "on";
  const orden = Number(formData.get("orden") ?? 0);
  const portada = formData.get("portada") as File | null;
  const archivo = formData.get("archivo") as File | null;

  if (!categoriaId || !titulo || !bajada) throw new Error("Categoría, título y bajada son obligatorios");

  const portadaUrl = portada && portada.size > 0 ? await saveUploadedFile(portada, "biblioteca/portadas") : null;
  const archivoUrl = archivo && archivo.size > 0 ? await saveUploadedFile(archivo, "biblioteca/archivos") : null;

  await prisma.bibliotecaPost.create({
    data: { categoriaId, titulo, bajada, publicado, orden, portadaUrl, archivoUrl },
  });

  revalidateTodo();
  redirect("/admin/biblioteca/posts");
}

export async function updatePost(id: string, formData: FormData) {
  await requireSession();

  const categoriaId = String(formData.get("categoriaId") ?? "").trim();
  const titulo = readRichText(formData.get("titulo"));
  const bajada = readRichText(formData.get("bajada"));
  const publicado = formData.get("publicado") === "on";
  const orden = Number(formData.get("orden") ?? 0);
  const portada = formData.get("portada") as File | null;
  const archivo = formData.get("archivo") as File | null;

  if (!categoriaId || !titulo || !bajada) throw new Error("Categoría, título y bajada son obligatorios");

  const data: {
    categoriaId: string;
    titulo: string;
    bajada: string;
    publicado: boolean;
    orden: number;
    portadaUrl?: string | null;
    archivoUrl?: string;
  } = { categoriaId, titulo, bajada, publicado, orden };

  if (portada && portada.size > 0) data.portadaUrl = await saveUploadedFile(portada, "biblioteca/portadas");
  else if (formData.get("portadaEliminar") === "1") data.portadaUrl = null;

  if (archivo && archivo.size > 0) data.archivoUrl = await saveUploadedFile(archivo, "biblioteca/archivos");

  await prisma.bibliotecaPost.update({ where: { id }, data });

  revalidateTodo();
  redirect("/admin/biblioteca/posts");
}

export async function deletePost(id: string) {
  await requireSession();
  await prisma.bibliotecaPost.delete({ where: { id } });
  revalidateTodo();
}
