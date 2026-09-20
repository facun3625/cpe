import { plainText } from "@/lib/rich-text";
import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { InstitucionalNav } from "@/components/admin/institucional-nav";
import { deleteAutoridad } from "./actions";

const GRUPO_LABELS: Record<string, string> = {
  CONSEJO_DIRECTIVO: "Consejo directivo",
  VOCAL_TITULAR: "Vocal titular",
  VOCAL_SUPLENTE: "Vocal suplente",
  SINDICO: "Síndico",
  ETICA_TITULAR: "Ética — titular",
  ETICA_SUPLENTE: "Ética — suplente",
};

export default async function AdminAutoridadesPage() {
  const autoridades = await prisma.autoridad.findMany({ orderBy: [{ grupo: "asc" }, { orden: "asc" }] });

  return (
    <div>
      <InstitucionalNav active="autoridades" />
      <PageHeader title="Autoridades" action={<NewButton href="/admin/institucional/autoridades/nueva">+ Nueva autoridad</NewButton>} />
      <AdminTable head={["Nombre", "Grupo", "Cargo", "Orden"]} empty={autoridades.length === 0 ? "Todavía no hay autoridades cargadas." : undefined}>
        {autoridades.map((a) => (
          <tr key={a.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{a.nombre}</td>
            <td className="px-4 py-3 text-gray-600">{GRUPO_LABELS[a.grupo]}</td>
            <td className="px-4 py-3 text-gray-600">{plainText(a.rol) || "—"}</td>
            <td className="px-4 py-3 text-gray-600">{a.orden}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/institucional/autoridades/${a.id}`} deleteAction={deleteAutoridad.bind(null, a.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
