import { plainText } from "@/lib/rich-text";
import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { deleteSede } from "./actions";

export default async function AdminSedesPage() {
  const sedes = await prisma.sede.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <PageHeader title="Sedes y delegaciones" action={<NewButton href="/admin/sedes/nueva">+ Nueva sede</NewButton>} />
      <AdminTable head={["Nombre", "Dirección", "Horario"]} empty={sedes.length === 0 ? "Todavía no hay sedes cargadas." : undefined}>
        {sedes.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{plainText(s.nombre)}</td>
            <td className="px-4 py-3 text-gray-600">{plainText(s.direccion)}</td>
            <td className="px-4 py-3 text-gray-600">{plainText(s.horario)}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/sedes/${s.id}`} deleteAction={deleteSede.bind(null, s.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
