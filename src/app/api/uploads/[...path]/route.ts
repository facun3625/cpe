import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const root = path.join(process.cwd(), "public", "uploads");
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  if (segments.some((segment) => !segment || segment.startsWith(".") || /[/\\\0]/.test(segment))) {
    return new Response(null, { status: 404 });
  }
  try {
    const [directory, filename] = await Promise.all([realpath(root), realpath(path.join(root, ...segments))]);
    if (!filename.startsWith(directory + path.sep)) return new Response(null, { status: 404 });
    const data = await readFile(filename);
    const contentType = contentTypes[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(data.length),
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        ...(contentType === "application/octet-stream" ? { "Content-Disposition": "attachment" } : {}),
      },
    });
  } catch (error) {
    if (["ENOENT", "ENOTDIR", "EISDIR"].includes((error as NodeJS.ErrnoException).code ?? "")) return new Response(null, { status: 404 });
    throw error;
  }
}
