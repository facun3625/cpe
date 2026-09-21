import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import path from "path";
import { saveUploadedFile } from "../src/lib/upload";

/**
 * Importa novedades históricas migradas del sitio viejo (cpesantafe.com.ar).
 * Lee scripts/novedades-import-data.json, descarga imágenes/adjuntos y crea
 * los registros que todavía no existan (dedup por título exacto).
 * Uso: npx tsx scripts/import-novedades.ts
 */

const prisma = new PrismaClient();

type ArchivoImport = { nombre: string; url: string };
type ArticuloImport = {
  titulo: string;
  categoria: string;
  publicadoEn: string;
  resumen: string;
  contenido: string;
  imagenUrl: string | null;
  galeria: string[];
  archivos: ArchivoImport[];
  sourceUrl?: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function descargarComoFile(url: string): Promise<File> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  const nombre = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "archivo");
  const tipo = res.headers.get("content-type") ?? "application/octet-stream";
  return new File([buffer], nombre, { type: tipo });
}

/** Solo re-alojamos archivos reales (pdf/doc/xls); los enlaces externos (ej. Google Forms) se guardan tal cual. */
const ARCHIVO_DESCARGABLE = /\.(pdf|docx?|xlsx?)(\?.*)?$/i;

async function main() {
  const dataPath = path.join(__dirname, "novedades-import-data.json");
  const articulos: ArticuloImport[] = JSON.parse(readFileSync(dataPath, "utf-8"));

  // Se calcula una sola vez, antes de crear nada: dos artículos de esta misma
  // importación pueden compartir título (ej. dos "Encuentro... San Javier" en
  // fechas distintas) y no deben pisarse entre sí, solo evitar los que ya
  // existían de antes en la base.
  const yaExistian = new Set((await prisma.novedad.findMany({ select: { titulo: true } })).map((n) => n.titulo));

  let creadas = 0;
  let omitidas = 0;

  for (const a of articulos) {
    if (yaExistian.has(a.titulo)) {
      console.log(`Omitida (ya existe): ${a.titulo}`);
      omitidas++;
      continue;
    }

    let imagenUrl: string | null = null;
    if (a.imagenUrl) {
      try {
        imagenUrl = await saveUploadedFile(await descargarComoFile(a.imagenUrl), "novedades");
      } catch (e) {
        console.warn(`  ⚠ No se pudo descargar la imagen principal: ${(e as Error).message}`);
      }
    }

    const galeria: string[] = [];
    for (const url of a.galeria ?? []) {
      try {
        galeria.push(await saveUploadedFile(await descargarComoFile(url), "novedades/galeria"));
      } catch (e) {
        console.warn(`  ⚠ No se pudo descargar imagen de galería: ${(e as Error).message}`);
      }
    }

    const archivos: ArchivoImport[] = [];
    for (const adj of a.archivos ?? []) {
      if (ARCHIVO_DESCARGABLE.test(adj.url)) {
        try {
          const url = await saveUploadedFile(await descargarComoFile(adj.url), "novedades/adjuntos");
          archivos.push({ nombre: adj.nombre, url });
          continue;
        } catch (e) {
          console.warn(`  ⚠ No se pudo descargar adjunto "${adj.nombre}", se guarda como enlace externo: ${(e as Error).message}`);
        }
      }
      archivos.push(adj);
    }

    const slug = `${slugify(a.titulo)}-${randomUUID().slice(0, 8)}`;

    await prisma.novedad.create({
      data: {
        titulo: a.titulo,
        slug,
        resumen: a.resumen,
        contenido: a.contenido || null,
        categoria: a.categoria,
        imagenUrl,
        galeria,
        publicadoEn: new Date(a.publicadoEn),
        publicada: true,
        ...(archivos.length ? { archivos: { create: archivos.map((ar, i) => ({ nombre: ar.nombre, url: ar.url, orden: i })) } } : {}),
      },
    });
    console.log(`✓ Creada: ${a.titulo}`);
    creadas++;
  }

  console.log(`\nListo. Creadas: ${creadas}. Omitidas (ya existían): ${omitidas}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
