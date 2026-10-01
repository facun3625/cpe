"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

function limpiarUrl(valor: FormDataEntryValue | null) {
  return String(valor ?? "").trim();
}

export async function guardarRedesSociales(formData: FormData) {
  await requireSession();

  const contenido = {
    instagram: limpiarUrl(formData.get("instagram")),
    facebook: limpiarUrl(formData.get("facebook")),
    youtube: limpiarUrl(formData.get("youtube")),
  };

  await prisma.paginaTexto.upsert({
    where: { pagina: "redes-sociales" },
    update: { contenido },
    create: { pagina: "redes-sociales", contenido },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/redes-sociales");
  redirect("/admin/redes-sociales?guardado=1");
}
