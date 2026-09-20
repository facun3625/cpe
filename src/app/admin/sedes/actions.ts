"use server";

import { readRichText } from "@/lib/rich-text";

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

function revalidateTodo() {
  revalidatePath("/");
  revalidatePath("/contacto");
  revalidatePath("/admin/sedes");
}

export async function createSede(formData: FormData) {
  await requireSession();

  const nombre = readRichText(formData.get("nombre"));
  const direccion = readRichText(formData.get("direccion"));
  const telefonos = lineas(formData.get("telefonos"));
  const horario = readRichText(formData.get("horario"));
  const email = String(formData.get("email") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!nombre || !direccion || !horario) throw new Error("Nombre, dirección y horario son obligatorios");

  await prisma.sede.create({ data: { nombre, direccion, telefonos, horario, email: email || null, orden } });

  revalidateTodo();
  redirect("/admin/sedes");
}

export async function updateSede(id: string, formData: FormData) {
  await requireSession();

  const nombre = readRichText(formData.get("nombre"));
  const direccion = readRichText(formData.get("direccion"));
  const telefonos = lineas(formData.get("telefonos"));
  const horario = readRichText(formData.get("horario"));
  const email = String(formData.get("email") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!nombre || !direccion || !horario) throw new Error("Nombre, dirección y horario son obligatorios");

  await prisma.sede.update({ where: { id }, data: { nombre, direccion, telefonos, horario, email: email || null, orden } });

  revalidateTodo();
  redirect("/admin/sedes");
}

export async function deleteSede(id: string) {
  await requireSession();
  await prisma.sede.delete({ where: { id } });
  revalidateTodo();
}
