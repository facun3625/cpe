"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/upload";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

export async function guardarSeo(formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const palabrasClave = String(formData.get("palabrasClave") ?? "").trim();
  const twitterHandle = String(formData.get("twitterHandle") ?? "").trim();
  const verificacionGoogle = String(formData.get("verificacionGoogle") ?? "").trim();
  const verificacionBing = String(formData.get("verificacionBing") ?? "").trim();
  const imagen = formData.get("imagenOg") as File | null;

  if (!titulo) throw new Error("El título del sitio es obligatorio");

  const data: {
    titulo: string;
    descripcion: string;
    palabrasClave: string;
    twitterHandle: string | null;
    verificacionGoogle: string | null;
    verificacionBing: string | null;
    imagenOg?: string;
  } = {
    titulo,
    descripcion,
    palabrasClave,
    twitterHandle: twitterHandle || null,
    verificacionGoogle: verificacionGoogle || null,
    verificacionBing: verificacionBing || null,
  };
  if (imagen && imagen.size > 0) {
    data.imagenOg = await saveUploadedFile(imagen, "seo");
  }

  await prisma.seoConfig.upsert({
    where: { id: "global" },
    create: { id: "global", ...data },
    update: data,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");
  redirect("/admin/seo");
}
