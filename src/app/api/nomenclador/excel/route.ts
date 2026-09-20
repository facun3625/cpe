import { prisma } from "@/lib/prisma";
import { readNomencladorConfig } from "@/lib/nomenclador/config";
import { exportPlanilla } from "@/lib/nomenclador/planilla";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [items, registro] = await prisma.$transaction([
      prisma.nomencladorItem.findMany({ orderBy: { orden: "asc" } }),
      prisma.paginaTexto.findUnique({ where: { pagina: "nomenclador" } }),
    ], { isolationLevel: "RepeatableRead" });
    const buffer = exportPlanilla(items, readNomencladorConfig(registro?.contenido));
    return new Response(new Uint8Array(buffer), { headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="Aranceles.xlsx"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    } });
  } catch { return Response.json({ error: "No se pudo generar el Excel. Intentá nuevamente." }, { status: 503 }); }
}
