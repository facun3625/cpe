import { plainText } from "@/lib/rich-text";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { BibliotecaNav } from "@/components/admin/biblioteca-nav";
import { deletePost } from "./actions";

export default async function AdminBibliotecaPostsPage() {
  const [posts, hayCategorias] = await Promise.all([
    prisma.bibliotecaPost.findMany({ orderBy: [{ categoria: { orden: "asc" } }, { orden: "asc" }], include: { categoria: true } }),
    prisma.bibliotecaCategoria.count(),
  ]);

  return (
    <div>
      <BibliotecaNav active="posts" />
      <div className="mt-6">
        <PageHeader
          title="Biblioteca — Posts"
          action={
            hayCategorias > 0 ? (
              <NewButton href="/admin/biblioteca/posts/nueva">+ Nuevo post</NewButton>
            ) : undefined
          }
        />

        {hayCategorias === 0 ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            Primero creá una <Link href="/admin/biblioteca" className="font-bold underline">categoría</Link> para poder cargar posts.
          </p>
        ) : (
          <AdminTable head={["Título", "Categoría", "Bibliografía", "Estado"]} empty={posts.length === 0 ? "Todavía no hay posts cargados." : undefined}>
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{plainText(p.titulo)}</td>
                <td className="px-4 py-3 text-gray-600">{p.categoria.nombre}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.archivoUrl ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.archivoUrl ? "Cargada" : "Sin PDF"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.publicado ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.publicado ? "Publicado" : "Oculto"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions editHref={`/admin/biblioteca/posts/${p.id}`} deleteAction={deletePost.bind(null, p.id)} />
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}
