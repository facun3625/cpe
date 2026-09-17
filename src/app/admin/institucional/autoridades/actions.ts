"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { auth } from "@/auth";
import type { AutoridadGrupo } from "@prisma/client";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function revalidateTodo() {
  revalidatePath("/institucional/autoridades");
  revalidatePath("/admin/institucional/autoridades");
}

async function readFoto(formData: FormData) {
  const foto = formData.get("foto");
  if (foto instanceof File && foto.size > 0) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(foto.type)) {
      throw new Error("La foto debe ser JPG, PNG, WebP, GIF o AVIF.");
    }
    if (foto.size > 10 * 1024 * 1024) throw new Error("La foto no debe superar los 10 MB.");
    return saveUploadedFile(foto, "autoridades");
  }
  return formData.get("fotoEliminar") === "1" ? null : undefined;
}

export async function createAutoridad(formData: FormData) {
  await requireSession();

  const grupo = String(formData.get("grupo") ?? "") as AutoridadGrupo;
  const rol = String(formData.get("rol") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!grupo || !nombre) throw new Error("Grupo y nombre son obligatorios");

  await prisma.autoridad.create({ data: { grupo, rol: rol || null, nombre, orden, fotoUrl: await readFoto(formData) } });

  revalidateTodo();
  redirect("/admin/institucional/autoridades");
}

export async function updateAutoridad(id: string, formData: FormData) {
  await requireSession();

  const grupo = String(formData.get("grupo") ?? "") as AutoridadGrupo;
  const rol = String(formData.get("rol") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!grupo || !nombre) throw new Error("Grupo y nombre son obligatorios");

  await prisma.autoridad.update({ where: { id }, data: { grupo, rol: rol || null, nombre, orden, fotoUrl: await readFoto(formData) } });

  revalidateTodo();
  redirect("/admin/institucional/autoridades");
}

export async function deleteAutoridad(id: string) {
  await requireSession();
  await prisma.autoridad.delete({ where: { id } });
  revalidateTodo();
}
