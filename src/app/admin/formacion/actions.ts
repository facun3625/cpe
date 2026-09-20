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

export async function guardarPropuestaEducativa(formData: FormData) {
  await requireSession();

  const contenido = {
    intro: readRichText(formData.get("intro")),
    parrafos: lineas(formData.get("parrafos")),
    firma: readRichText(formData.get("firma")),
  };

  await prisma.paginaTexto.upsert({
    where: { pagina: "propuesta-educativa" },
    update: { contenido },
    create: { pagina: "propuesta-educativa", contenido },
  });

  revalidatePath("/actividad-academica/propuesta-educativa");
  revalidatePath("/admin/formacion");
  redirect("/admin/formacion");
}
