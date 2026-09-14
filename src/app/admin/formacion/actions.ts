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

export async function guardarPropuestaEducativa(formData: FormData) {
  await requireSession();

  const contenido = {
    intro: String(formData.get("intro") ?? "").trim(),
    parrafos: lineas(formData.get("parrafos")),
    firma: String(formData.get("firma") ?? "").trim(),
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
