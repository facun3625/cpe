import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { deleteSeccionItem } from "../actions";

const TITULOS: Record<string, string> = {
  institucional: "Portada de Institucional",
  biblioteca: "Biblioteca",
  "actividad-academica": "Portada de Actividad académica",
};

export default async function AdminSeccionPage({ params }: { params: Promise<{ pagina: string }> }) {
  const { pagina } = await params;
  const items = await prisma.seccionItem.findMany({ where: { pagina }, orderBy: { orden: "asc" } });

  return (
    <div>
      <PageHeader title={TITULOS[pagina] ?? pagina} action={<NewButton href={`/admin/secciones/${pagina}/nueva`}>+ Nueva card</NewButton>} />
      <AdminTable head={["Título", "Link", "Orden"]} empty={items.length === 0 ? "Todavía no hay cards cargadas." : undefined}>
        {items.map((i) => (
          <tr key={i.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{i.titulo}</td>
            <td className="px-4 py-3 text-gray-600">{i.href ?? "—"}</td>
            <td className="px-4 py-3 text-gray-600">{i.orden}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/secciones/${pagina}/${i.id}`} deleteAction={deleteSeccionItem.bind(null, i.id, pagina)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
