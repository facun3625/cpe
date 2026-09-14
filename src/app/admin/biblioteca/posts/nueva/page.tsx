import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BibliotecaNav } from "@/components/admin/biblioteca-nav";
import { BibliotecaPostForm } from "@/components/admin/biblioteca-post-form";
import { createPost } from "../actions";

export default async function NuevoPostPage() {
  const categorias = await prisma.bibliotecaCategoria.findMany({ orderBy: { orden: "asc" } });
  if (categorias.length === 0) redirect("/admin/biblioteca/posts");

  return (
    <div>
      <BibliotecaNav active="posts" />
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">Nuevo post</h1>
      <div className="mt-6">
        <BibliotecaPostForm action={createPost} categorias={categorias} submitLabel="Crear post" />
      </div>
    </div>
  );
}
