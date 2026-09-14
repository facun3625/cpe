"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

export async function guardarBecas(formData: FormData) {
  await requireSession();

  const requisitos = String(formData.get("requisitos") ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

  await prisma.paginaTexto.upsert({
    where: { pagina: "becas" },
    update: { contenido: { requisitos } },
    create: { pagina: "becas", contenido: { requisitos } },
  });

  revalidatePath("/becas");
  revalidatePath("/admin/becas");
  redirect("/admin/becas");
}
