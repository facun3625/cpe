import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, TextInput } from "@/components/admin/fields";
import { NomencladorFila } from "@/components/admin/nomenclador-fila";
import { formatFechaHora } from "@/lib/format";
import { deleteNomencladorItem, updateMontoNomenclador } from "./actions";

export default async function AdminNomencladorPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const items = await prisma.nomencladorItem.findMany({
    where: q ? { nombre: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { orden: "asc" },
  });

  return (
    <div>
      <PageHeader title="Nomenclador" action={<NewButton href="/admin/nomenclador/nueva">+ Nueva prestación</NewButton>} />
      <p className="mt-2 text-sm text-slate-500">{items.length} prestaciones {q ? `que coinciden con "${q}"` : "en total"}.</p>
      <form className="mt-4">
        <TextInput name="q" defaultValue={q ?? ""} placeholder="Buscar por nombre…" />
      </form>
      <p className="mt-4 text-xs text-slate-400">
        Los montos (CD, CN/DD, DN) se editan directamente en la tabla: cambiá el valor y presioná <span className="font-semibold text-slate-500">Guardar</span> (o Enter).
      </p>
      <AdminTable
        head={["Prestación", "Tiempo", "CD", "CN/DD", "DN", "Actualizado"]}
        empty={items.length === 0 ? "No se encontraron prestaciones." : undefined}
      >
        {items.map((i) => (
          <NomencladorFila
            key={i.id}
            item={{ id: i.id, nombre: i.nombre, tiempo: i.tiempo, cd: i.cd, cn: i.cn, dn: i.dn, actualizadoDisplay: formatFechaHora(i.updatedAt) }}
            updateAction={updateMontoNomenclador}
            deleteAction={deleteNomencladorItem}
          />
        ))}
      </AdminTable>
    </div>
  );
}
