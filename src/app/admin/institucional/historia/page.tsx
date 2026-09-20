import { plainText } from "@/lib/rich-text";
import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { InstitucionalNav } from "@/components/admin/institucional-nav";
import { deleteHito } from "./actions";

export default async function AdminHistoriaPage() {
  const hitos = await prisma.hitoHistoria.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <InstitucionalNav active="historia" />
      <PageHeader title="Historia" action={<NewButton href="/admin/institucional/historia/nueva">+ Nuevo hito</NewButton>} />
      <AdminTable head={["Año", "Título", "Orden"]} empty={hitos.length === 0 ? "Todavía no hay hitos cargados." : undefined}>
        {hitos.map((h) => (
          <tr key={h.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{h.anio}</td>
            <td className="px-4 py-3 text-gray-600">{plainText(h.titulo)}</td>
            <td className="px-4 py-3 text-gray-600">{h.orden}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/institucional/historia/${h.id}`} deleteAction={deleteHito.bind(null, h.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
