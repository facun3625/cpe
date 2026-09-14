"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function lineas(valor: FormDataEntryValue | null) {
  return String(valor ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateTodo() {
  revalidatePath("/tramites");
  revalidatePath("/admin/tramites");
}

export async function createTramite(formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const requisitos = lineas(formData.get("requisitos"));
  const orden = Number(formData.get("orden") ?? 0);

  if (!titulo || !texto) throw new Error("Título y texto son obligatorios");

  await prisma.tramite.create({ data: { titulo, texto, requisitos, orden, slug: slugify(titulo) } });

  revalidateTodo();
  redirect("/admin/tramites");
}

export async function updateTramite(id: string, formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const requisitos = lineas(formData.get("requisitos"));
  const orden = Number(formData.get("orden") ?? 0);

  if (!titulo || !texto) throw new Error("Título y texto son obligatorios");

  await prisma.tramite.update({ where: { id }, data: { titulo, texto, requisitos, orden } });

  revalidateTodo();
  redirect("/admin/tramites");
}

export async function deleteTramite(id: string) {
  await requireSession();
  await prisma.tramite.delete({ where: { id } });
  revalidateTodo();
}
