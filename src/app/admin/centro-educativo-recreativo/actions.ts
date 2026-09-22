"use server";

import { readRichText } from "@/lib/rich-text";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/upload";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

type OrdenToken = { t: "e"; u: string } | { t: "n" };

/** Reconstruye el array final de la galería a partir del orden armado en el cliente
 * (mezcla de imágenes existentes conservadas y nuevas subidas), en el orden elegido. */
async function resolverGaleria(formData: FormData): Promise<string[]> {
  let tokens: OrdenToken[] = [];
  try {
    tokens = JSON.parse(String(formData.get("galeriaOrden") ?? "[]"));
  } catch {
    tokens = [];
  }

  const nuevos = formData.getAll("galeriaNuevas").filter((f): f is File => f instanceof File && f.size > 0);
  const nuevasUrls: string[] = [];
  for (const archivo of nuevos) {
    nuevasUrls.push(await saveUploadedFile(archivo, "centro-educativo-recreativo"));
  }

  let i = 0;
  const galeria: string[] = [];
  for (const token of tokens) {
    if (token.t === "e") galeria.push(token.u);
    else if (nuevasUrls[i] !== undefined) galeria.push(nuevasUrls[i++]);
  }
  return galeria;
}

export async function guardarCer(formData: FormData) {
  await requireSession();

  const texto = readRichText(formData.get("texto"));
  const galeria = await resolverGaleria(formData);
  const contenido = { texto, galeria };

  await prisma.paginaTexto.upsert({
    where: { pagina: "centro-educativo-recreativo" },
    update: { contenido },
    create: { pagina: "centro-educativo-recreativo", contenido },
  });

  revalidatePath("/centro-educativo-recreativo");
  revalidatePath("/admin/centro-educativo-recreativo");
  redirect("/admin/centro-educativo-recreativo");
}
