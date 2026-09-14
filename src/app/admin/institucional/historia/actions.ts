"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function revalidateTodo() {
  revalidatePath("/institucional/historia");
  revalidatePath("/admin/institucional/historia");
}

export async function createHito(formData: FormData) {
  await requireSession();

  const anio = String(formData.get("anio") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!anio || !titulo || !texto) throw new Error("Todos los campos son obligatorios");

  await prisma.hitoHistoria.create({ data: { anio, titulo, texto, orden } });

  revalidateTodo();
  redirect("/admin/institucional/historia");
}

export async function updateHito(id: string, formData: FormData) {
  await requireSession();

  const anio = String(formData.get("anio") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!anio || !titulo || !texto) throw new Error("Todos los campos son obligatorios");

  await prisma.hitoHistoria.update({ where: { id }, data: { anio, titulo, texto, orden } });

  revalidateTodo();
  redirect("/admin/institucional/historia");
}

export async function deleteHito(id: string) {
  await requireSession();
  await prisma.hitoHistoria.delete({ where: { id } });
  revalidateTodo();
}
