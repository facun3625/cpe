import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NovedadesBuscador } from "@/components/admin/novedades-buscador";
import { deleteNovedad, toggleDestacadaHome } from "./actions";

export default async function AdminNovedadesPage() {
  const [novedades, categorias] = await Promise.all([
    prisma.novedad.findMany({ orderBy: { publicadoEn: "desc" } }),
    prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } }),
  ]);

  const filas = novedades.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    categoria: n.categoria,
    fecha: new Intl.DateTimeFormat("es-AR").format(n.publicadoEn),
    publicada: n.publicada,
    destacadaHome: n.destacadaHome,
  }));

  const nombresCategorias = categorias.map((c) => c.nombre);
  for (const n of novedades) {
    if (!nombresCategorias.includes(n.categoria)) nombresCategorias.push(n.categoria);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Novedades</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/novedades/categorias"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Categorías
          </Link>
          <Link
            href="/admin/novedades/nueva"
            className="rounded-md bg-cpe-navy px-4 py-2 text-sm font-semibold text-white hover:bg-cpe-navy-light"
          >
            + Nueva novedad
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <NovedadesBuscador
          novedades={filas}
          categorias={nombresCategorias}
          deleteAction={deleteNovedad}
          toggleDestacadaAction={toggleDestacadaHome}
        />
      </div>
    </div>
  );
}
