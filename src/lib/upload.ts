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
 * Valida que un archivo subido sea realmente un PDF o una imagen JPG/PNG: revisa la
 * extensión y la firma binaria, ya que el atributo `accept` del input no impide
 * subir otro tipo de archivo.
 */
export async function assertPdfOrImagen(file: File) {
  if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) throw new Error("El archivo debe ser un PDF, JPG o PNG.");
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const esPdf = new TextDecoder().decode(header.slice(0, 5)) === "%PDF-";
  const esJpg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const esPng = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => header[i] === b);
  if (!esPdf && !esJpg && !esPng) throw new Error("El archivo no es un PDF, JPG o PNG válido.");
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
