"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/upload";
import type { PopupTipo } from "@prisma/client";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

export async function guardarPopup(formData: FormData) {
  await requireSession();

  const activo = formData.get("activo") === "on";
  const tipo = String(formData.get("tipo") ?? "TEXTO") as PopupTipo;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const mostrarSiempre = formData.get("mostrarSiempre") === "on";
  const imagen = formData.get("imagen") as File | null;

  const data: {
    activo: boolean;
    tipo: PopupTipo;
    titulo: string | null;
    texto: string | null;
    videoUrl: string | null;
    mostrarSiempre: boolean;
    imagenUrl?: string | null;
  } = {
    activo,
    tipo,
    titulo: titulo || null,
    texto: texto || null,
    videoUrl: videoUrl || null,
    mostrarSiempre,
  };
  if (imagen && imagen.size > 0) {
    data.imagenUrl = await saveUploadedFile(imagen, "popup");
  } else if (formData.get("imagenEliminar") === "1") {
    data.imagenUrl = null;
  }

  await prisma.popupConfig.upsert({
    where: { id: "global" },
    create: { id: "global", ...data },
    update: data,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/popup");
  redirect("/admin/popup");
}
