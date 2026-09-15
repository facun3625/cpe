import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { deleteCategoria } from "./actions";

export default async function AdminNovedadCategoriasPage() {
  const categorias = await prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <Link href="/admin/novedades" className="text-sm font-medium text-cpe-blue hover:underline">← Novedades</Link>

      <div className="mt-4">
        <PageHeader title="Categorías de Novedades" action={<NewButton href="/admin/novedades/categorias/nueva">+ Nueva categoría</NewButton>} />
        <p className="mt-2 text-sm text-slate-500">
          Definen las opciones del selector al cargar una novedad y los filtros que se muestran en el sitio público.
        </p>

        <AdminTable head={["Nombre", "Orden"]} empty={categorias.length === 0 ? "Todavía no hay categorías cargadas." : undefined}>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium text-gray-900">{c.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{c.orden}</td>
              <td className="px-4 py-3 text-right">
                <RowActions editHref={`/admin/novedades/categorias/${c.id}`} deleteAction={deleteCategoria.bind(null, c.id)} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
