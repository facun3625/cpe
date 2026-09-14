import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { InstitucionalNav } from "@/components/admin/institucional-nav";
import { deleteComision } from "./actions";

export default async function AdminComisionesPage() {
  const comisiones = await prisma.comision.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <InstitucionalNav active="comisiones" />
      <PageHeader title="Comisiones" action={<NewButton href="/admin/institucional/comisiones/nueva">+ Nueva comisión</NewButton>} />
      <AdminTable head={["Título", "Trámites relacionados", "Orden"]} empty={comisiones.length === 0 ? "Todavía no hay comisiones cargadas." : undefined}>
        {comisiones.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{c.titulo}</td>
            <td className="px-4 py-3 text-gray-600">{c.tramitesRelacionados.length}</td>
            <td className="px-4 py-3 text-gray-600">{c.orden}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/institucional/comisiones/${c.id}`} deleteAction={deleteComision.bind(null, c.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
