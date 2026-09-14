"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatFechaHora } from "@/lib/format";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function revalidateTodo() {
  revalidatePath("/nomenclador");
  revalidatePath("/admin/nomenclador");
}

function numero(valor: FormDataEntryValue | null) {
  return Number(String(valor ?? "0").replace(",", "."));
}

export async function createNomencladorItem(formData: FormData) {
  await requireSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const tiempo = String(formData.get("tiempo") ?? "").trim();
  const upe = Math.round(numero(formData.get("upe")));
  const cd = numero(formData.get("cd"));
  const cn = numero(formData.get("cn"));
  const dn = numero(formData.get("dn"));
  const noReconocida = formData.get("noReconocida") === "on";
  const orden = Number(formData.get("orden") ?? 0);

  if (!nombre || !tiempo) throw new Error("Nombre y tiempo son obligatorios");

  await prisma.nomencladorItem.create({ data: { nombre, tiempo, upe, cd, cn, dn, noReconocida, orden } });

  revalidateTodo();
  redirect("/admin/nomenclador");
}

export async function updateNomencladorItem(id: string, formData: FormData) {
  await requireSession();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const tiempo = String(formData.get("tiempo") ?? "").trim();
  const upe = Math.round(numero(formData.get("upe")));
  const cd = numero(formData.get("cd"));
  const cn = numero(formData.get("cn"));
  const dn = numero(formData.get("dn"));
  const noReconocida = formData.get("noReconocida") === "on";
  const orden = Number(formData.get("orden") ?? 0);

  if (!nombre || !tiempo) throw new Error("Nombre y tiempo son obligatorios");

  await prisma.nomencladorItem.update({ where: { id }, data: { nombre, tiempo, upe, cd, cn, dn, noReconocida, orden } });

  revalidateTodo();
  redirect("/admin/nomenclador");
}

export async function updateMontoNomenclador(id: string, formData: FormData): Promise<{ ok: true; actualizadoDisplay: string }> {
  await requireSession();

  const cd = numero(formData.get("cd"));
  const cn = numero(formData.get("cn"));
  const dn = numero(formData.get("dn"));

  const actualizado = await prisma.nomencladorItem.update({ where: { id }, data: { cd, cn, dn } });

  revalidateTodo();
  return { ok: true, actualizadoDisplay: formatFechaHora(actualizado.updatedAt) };
}

export async function deleteNomencladorItem(id: string) {
  await requireSession();
  await prisma.nomencladorItem.delete({ where: { id } });
  revalidateTodo();
}
