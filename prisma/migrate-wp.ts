/**
 * Migración puntual: importa las últimas N novedades del WordPress viejo
 * (cpesantafe.com.ar) a la tabla Novedad, vía la REST API pública de WP.
 * Idempotente: si una novedad con el mismo slug ya existe, se saltea.
 *
 * Correr con: npx tsx prisma/migrate-wp.ts [cantidad]
 * Por defecto trae las últimas 4. Ej: npx tsx prisma/migrate-wp.ts 10
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

const WP_BASE = "https://cpesantafe.com.ar/wp-json/wp/v2";
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "novedades");
const CANTIDAD = Number(process.argv[2] ?? 4) || 4;

const CATEGORIAS_DELEGACION = ["Delegación Santa Fe", "Delegación Rafaela", "Delegación Reconquista"];
const CATEGORIA_DEFAULT = "Artículos de Interés";

type WpMedia = { source_url: string };
type WpTerm = { name: string };
type WpPost = {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: { "wp:featuredmedia"?: WpMedia[]; "wp:term"?: WpTerm[][] };
};

const ENTIDADES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTIDADES[name.toLowerCase()] ?? m);
}

function stripHtml(html: string): string {
  const sinBloques = html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, "");
  const conSaltos = sinBloques
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n");
  const sinTags = conSaltos.replace(/<[^>]+>/g, "");
  const texto = decodeEntities(sinTags);
  return texto.split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
}

function extraerImagenes(html: string): string[] {
  const urls: string[] = [];
  const re = /<img[^>]+src="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) {
    if (m[1].includes("/wp-content/uploads/")) urls.push(m[1]);
  }
  return [...new Set(urls)];
}

function categoriaDe(post: WpPost): string {
  const terminos = post._embedded?.["wp:term"]?.flat() ?? [];
  for (const nombre of CATEGORIAS_DELEGACION) {
    if (terminos.some((t) => t.name === nombre)) return nombre;
  }
  return CATEGORIA_DEFAULT;
}

function sanitizeFilename(name: string) {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

async function descargarImagen(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const nombreOriginal = decodeURIComponent(url.split("/").pop() ?? "imagen.jpg");
    const filename = `${randomUUID()}-${sanitizeFilename(nombreOriginal)}`;
    await writeFile(path.join(UPLOADS_DIR, filename), buffer);
    return `/uploads/novedades/${filename}`;
  } catch {
    return null;
  }
}

async function main() {
  await mkdir(UPLOADS_DIR, { recursive: true });

  console.log(`Trayendo las últimas ${CANTIDAD} novedades de WordPress...`);
  const res = await fetch(`${WP_BASE}/posts?per_page=${CANTIDAD}&_embed=1`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`WP API error: ${res.status}`);
  const posts: WpPost[] = await res.json();

  let creadas = 0;
  let salteadas = 0;
  let errores = 0;

  for (const post of posts) {
    try {
      const existente = await prisma.novedad.findUnique({ where: { slug: post.slug } });
      if (existente) {
        console.log(`Ya existe, salteo: ${post.slug}`);
        salteadas++;
        continue;
      }

      const titulo = decodeEntities(post.title.rendered.replace(/<[^>]+>/g, "")).trim();
      const contenidoTexto = stripHtml(post.content.rendered);
      let resumen = decodeEntities(post.excerpt.rendered.replace(/<[^>]+>/g, "")).trim();
      if (!resumen) resumen = contenidoTexto.slice(0, 220).trim();
      if (!resumen) resumen = "Novedad del Colegio de Profesionales en Enfermería de Santa Fe.";

      const destacada = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      const imagenesContenido = extraerImagenes(post.content.rendered);
      const todasLasImagenes = [...new Set([...(destacada ? [destacada] : []), ...imagenesContenido])].slice(0, 12);

      const urlsDescargadas: string[] = [];
      for (const url of todasLasImagenes) {
        const local = await descargarImagen(url);
        if (local) urlsDescargadas.push(local);
      }

      const categoria = categoriaDe(post);

      await prisma.novedad.create({
        data: {
          titulo,
          slug: post.slug,
          resumen,
          contenido: contenidoTexto || null,
          categoria,
          imagenUrl: urlsDescargadas[0] ?? null,
          galeria: urlsDescargadas.slice(1),
          publicadoEn: new Date(post.date),
          publicada: true,
        },
      });
      console.log(`Creada: ${titulo} [${categoria}]`);
      creadas++;
    } catch (e) {
      errores++;
      console.error(`Error en post ${post.slug}:`, e);
    }
  }

  console.log(`\nListo. Creadas: ${creadas} | Salteadas (ya existían): ${salteadas} | Errores: ${errores}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
