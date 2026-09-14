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
  revalidatePath("/admin/biblioteca");
  revalidatePath("/admin/biblioteca/posts");
  revalidatePath("/biblioteca");
}

export async function createCategoria(formData: FormData) {
  await requireSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!nombre) throw new Error("El nombre es obligatorio");

  await prisma.bibliotecaCategoria.create({ data: { nombre, orden } });

  revalidateTodo();
  redirect("/admin/biblioteca");
}

export async function updateCategoria(id: string, formData: FormData) {
  await requireSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!nombre) throw new Error("El nombre es obligatorio");

  await prisma.bibliotecaCategoria.update({ where: { id }, data: { nombre, orden } });

  revalidateTodo();
  redirect("/admin/biblioteca");
}

export async function deleteCategoria(id: string) {
  await requireSession();
  await prisma.bibliotecaCategoria.delete({ where: { id } });
  revalidateTodo();
}
