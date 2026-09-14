import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BibliotecaNav } from "@/components/admin/biblioteca-nav";
import { BibliotecaPostForm } from "@/components/admin/biblioteca-post-form";
import { updatePost } from "../actions";

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categorias] = await Promise.all([
    prisma.bibliotecaPost.findUnique({ where: { id } }),
    prisma.bibliotecaCategoria.findMany({ orderBy: { orden: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <BibliotecaNav active="posts" />
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">Editar post</h1>
      <div className="mt-6">
        <BibliotecaPostForm action={updatePost.bind(null, post.id)} categorias={categorias} defaultValues={post} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
