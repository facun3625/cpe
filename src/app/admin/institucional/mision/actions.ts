"use server";

import { readRichText, richTextLines } from "@/lib/rich-text";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function lineas(valor: FormDataEntryValue | null) {
  return richTextLines(valor);
}

export async function guardarMision(formData: FormData) {
  await requireSession();

  const contenido = {
    misionTitulo: readRichText(formData.get("misionTitulo")),
    misionTexto: readRichText(formData.get("misionTexto")),
    visionTitulo: readRichText(formData.get("visionTitulo")),
    visionTexto: readRichText(formData.get("visionTexto")),
    propositos: lineas(formData.get("propositos")),
  };

  await prisma.paginaTexto.upsert({
    where: { pagina: "mision" },
    update: { contenido },
    create: { pagina: "mision", contenido },
  });

  revalidatePath("/institucional/mision");
  revalidatePath("/admin/institucional/mision");
  redirect("/admin/institucional");
}
