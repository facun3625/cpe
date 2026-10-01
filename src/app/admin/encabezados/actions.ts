"use server";

import { readRichText } from "@/lib/rich-text";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { HEROES, heroPaginaKey } from "@/lib/page-hero";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

export async function guardarHero(formData: FormData) {
  await requireSession();

  const key = String(formData.get("key") ?? "");
  const definicion = HEROES.find((h) => h.key === key);
  if (!definicion) throw new Error("Página inválida.");

  const contenido = {
    eyebrow: readRichText(formData.get("eyebrow")),
    titulo: readRichText(formData.get("titulo")),
    intro: readRichText(formData.get("intro")),
  };

  await prisma.paginaTexto.upsert({
    where: { pagina: heroPaginaKey(key) },
    update: { contenido },
    create: { pagina: heroPaginaKey(key), contenido },
  });

  revalidatePath(definicion.ruta);
  revalidatePath("/admin/encabezados");
  redirect("/admin/encabezados?guardado=" + encodeURIComponent(key));
}
