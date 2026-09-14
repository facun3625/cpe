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

export async function guardarMision(formData: FormData) {
  await requireSession();

  const contenido = {
    misionTitulo: String(formData.get("misionTitulo") ?? "").trim(),
    misionTexto: String(formData.get("misionTexto") ?? "").trim(),
    visionTitulo: String(formData.get("visionTitulo") ?? "").trim(),
    visionTexto: String(formData.get("visionTexto") ?? "").trim(),
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
