"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

export async function createAutoridad(formData: FormData) {
  await requireSession();

  const grupo = String(formData.get("grupo") ?? "") as AutoridadGrupo;
  const rol = String(formData.get("rol") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!grupo || !nombre) throw new Error("Grupo y nombre son obligatorios");

  await prisma.autoridad.create({ data: { grupo, rol: rol || null, nombre, orden } });

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

  await prisma.autoridad.update({ where: { id }, data: { grupo, rol: rol || null, nombre, orden } });

  revalidateTodo();
  redirect("/admin/institucional/autoridades");
}

export async function deleteAutoridad(id: string) {
  await requireSession();
  await prisma.autoridad.delete({ where: { id } });
  revalidateTodo();
}
