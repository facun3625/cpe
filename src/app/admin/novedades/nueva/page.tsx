import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NovedadForm } from "@/components/admin/novedad-form";
import { createNovedad } from "../actions";

export default async function NuevaNovedadPage() {
  const categorias = await prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } });

  if (categorias.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Nueva novedad</h1>
        <p className="mt-4 text-sm text-slate-600">
          Todavía no hay categorías cargadas. Creá al menos una antes de poder publicar una novedad.
        </p>
        <Link href="/admin/novedades/categorias/nueva" className="mt-4 inline-block rounded-md bg-cpe-navy px-4 py-2 text-sm font-semibold text-white hover:bg-cpe-navy-light">
          + Nueva categoría
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva novedad</h1>
      <div className="mt-6">
        <NovedadForm action={createNovedad} submitLabel="Crear novedad" categorias={categorias.map((c) => c.nombre)} />
      </div>
    </div>
  );
}
