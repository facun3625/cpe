import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { BibliotecaNav } from "@/components/admin/biblioteca-nav";
import { deleteCategoria } from "./actions";

export default async function AdminBibliotecaPage() {
  const categorias = await prisma.bibliotecaCategoria.findMany({
    orderBy: { orden: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <BibliotecaNav active="categorias" />
      <div className="mt-6">
        <PageHeader title="Biblioteca — Categorías" action={<NewButton href="/admin/biblioteca/nueva">+ Nueva categoría</NewButton>} />
        <p className="mt-2 text-sm text-slate-500">
          Agrupan los posts de la biblioteca (ej. Manuales, Revistas). Eliminar una categoría elimina también sus posts.
        </p>

        <AdminTable head={["Nombre", "Posts", "Orden"]} empty={categorias.length === 0 ? "Todavía no hay categorías. Creá la primera para poder cargar posts." : undefined}>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium text-gray-900">{c.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{c._count.posts}</td>
              <td className="px-4 py-3 text-gray-600">{c.orden}</td>
              <td className="px-4 py-3 text-right">
                <RowActions editHref={`/admin/biblioteca/${c.id}`} deleteAction={deleteCategoria.bind(null, c.id)} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
