"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

const RUTA_PUBLICA: Record<string, string> = {
  institucional: "/institucional",
  biblioteca: "/biblioteca",
  "actividad-academica": "/actividad-academica",
};

function revalidateTodo(pagina: string) {
  revalidatePath("/admin/secciones/" + pagina);
  const ruta = RUTA_PUBLICA[pagina];
  if (ruta) revalidatePath(ruta);
}

export async function createSeccionItem(pagina: string, formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!titulo || !texto) throw new Error("Título y texto son obligatorios");

  await prisma.seccionItem.create({ data: { pagina, titulo, texto, href: href || null, orden } });

  revalidateTodo(pagina);
  redirect(`/admin/secciones/${pagina}`);
}

export async function updateSeccionItem(id: string, pagina: string, formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);

  if (!titulo || !texto) throw new Error("Título y texto son obligatorios");

  await prisma.seccionItem.update({ where: { id }, data: { titulo, texto, href: href || null, orden } });

  revalidateTodo(pagina);
  redirect(`/admin/secciones/${pagina}`);
}

export async function deleteSeccionItem(id: string, pagina: string) {
  await requireSession();
  await prisma.seccionItem.delete({ where: { id } });
  revalidateTodo(pagina);
}
