import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { deleteTramite } from "./actions";

export default async function AdminTramitesPage() {
  const tramites = await prisma.tramite.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <PageHeader title="Trámites" action={<NewButton href="/admin/tramites/nueva">+ Nuevo trámite</NewButton>} />
      <AdminTable head={["Título", "Requisitos", "Orden"]} empty={tramites.length === 0 ? "Todavía no hay trámites cargados." : undefined}>
        {tramites.map((t) => (
          <tr key={t.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{t.titulo}</td>
            <td className="px-4 py-3 text-gray-600">{t.requisitos.length}</td>
            <td className="px-4 py-3 text-gray-600">{t.orden}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/tramites/${t.id}`} deleteAction={deleteTramite.bind(null, t.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
      <p className="mt-4 text-xs text-slate-500">
        Para adjuntar la «nota modelo» de un trámite, cargá el PDF en <a href="/admin/documentos/nueva" className="font-semibold text-cpe-blue hover:underline">Documentos</a> con tipo «Nota modelo» y el campo Grupo igual al slug del trámite.
      </p>
    </div>
  );
}
