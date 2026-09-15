"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { saveUploadedFile } from "@/lib/upload";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
    nuevasUrls.push(await saveUploadedFile(archivo, "novedades/galeria"));
  }

  let i = 0;
  const galeria: string[] = [];
  for (const token of tokens) {
    if (token.t === "e") galeria.push(token.u);
    else if (nuevasUrls[i] !== undefined) galeria.push(nuevasUrls[i++]);
  }
  return galeria;
}

async function resolverAdjuntosNuevos(formData: FormData) {
  const archivos = formData.getAll("archivosNuevos").filter((f): f is File => f instanceof File && f.size > 0);
  const guardados: { nombre: string; url: string }[] = [];
  for (const archivo of archivos) {
    const url = await saveUploadedFile(archivo, "novedades/adjuntos");
    guardados.push({ nombre: archivo.name, url });
  }
  return guardados;
}

export async function createNovedad(formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const resumen = String(formData.get("resumen") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "Institucional").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const publicada = formData.get("publicada") === "on";
  const destacadaHome = formData.get("destacadaHome") === "on";
  const imagen = formData.get("imagen") as File | null;

  if (!titulo || !resumen) {
    throw new Error("Título y resumen son obligatorios");
  }

  const imagenUrl = imagen && imagen.size > 0 ? await saveUploadedFile(imagen, "novedades") : null;
  const galeria = await resolverGaleria(formData);
  const adjuntos = await resolverAdjuntosNuevos(formData);

  await prisma.novedad.create({
    data: {
      titulo,
      slug: `${slugify(titulo)}-${Date.now().toString(36)}`,
      resumen,
      contenido: contenido || null,
      categoria: categoria || "Institucional",
      imagenUrl,
      galeria,
      videoUrl: videoUrl || null,
      publicada,
      destacadaHome,
      archivos: adjuntos.length > 0 ? { create: adjuntos.map((a, i) => ({ ...a, orden: i })) } : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/novedades");
  redirect("/admin/novedades");
}

export async function updateNovedad(id: string, formData: FormData) {
  await requireSession();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const resumen = String(formData.get("resumen") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "Institucional").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const publicada = formData.get("publicada") === "on";
  const destacadaHome = formData.get("destacadaHome") === "on";
  const imagen = formData.get("imagen") as File | null;
  const archivosEliminar = formData.getAll("archivosEliminar").map(String);

  if (!titulo || !resumen) {
    throw new Error("Título y resumen son obligatorios");
  }

  const galeria = await resolverGaleria(formData);
  const adjuntosNuevos = await resolverAdjuntosNuevos(formData);

  const data: {
    titulo: string;
    resumen: string;
    contenido: string | null;
    categoria: string;
    publicada: boolean;
    destacadaHome: boolean;
    videoUrl: string | null;
    galeria: string[];
    imagenUrl?: string;
  } = {
    titulo,
    resumen,
    contenido: contenido || null,
    categoria: categoria || "Institucional",
    publicada,
    destacadaHome,
    videoUrl: videoUrl || null,
    galeria,
  };
  if (imagen && imagen.size > 0) {
    data.imagenUrl = await saveUploadedFile(imagen, "novedades");
  }

  if (archivosEliminar.length > 0) {
    await prisma.novedadArchivo.deleteMany({ where: { id: { in: archivosEliminar }, novedadId: id } });
  }

  await prisma.novedad.update({
    where: { id },
    data: {
      ...data,
      archivos: adjuntosNuevos.length > 0 ? { create: adjuntosNuevos.map((a, i) => ({ ...a, orden: i })) } : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/novedades");
  redirect("/admin/novedades");
}

export async function deleteNovedad(id: string) {
  await requireSession();

  await prisma.novedad.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/novedades");
}

export async function toggleDestacadaHome(id: string, destacadaHome: boolean) {
  await requireSession();

  await prisma.novedad.update({ where: { id }, data: { destacadaHome } });

  revalidatePath("/");
  revalidatePath("/admin/novedades");
}
