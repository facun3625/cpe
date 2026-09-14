import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

function sanitizeFilename(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

/**
 * Guarda un archivo subido desde un formulario en public/uploads/<carpeta>/ y devuelve
 * la URL pública para servirlo. `carpeta` agrupa archivos por sección (ej. "documentos",
 * "novedades") y nunca debe venir de input del usuario sin validar.
 */
export async function saveUploadedFile(file: File, carpeta: string): Promise<string> {
  const dir = path.join(UPLOADS_ROOT, carpeta);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${carpeta}/${filename}`;
}
