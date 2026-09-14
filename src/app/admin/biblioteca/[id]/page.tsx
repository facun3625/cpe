import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BibliotecaNav } from "@/components/admin/biblioteca-nav";
import { BibliotecaCategoriaForm } from "@/components/admin/biblioteca-categoria-form";
import { updateCategoria } from "../actions";

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoria = await prisma.bibliotecaCategoria.findUnique({ where: { id } });

  if (!categoria) notFound();

  return (
    <div>
      <BibliotecaNav active="categorias" />
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">Editar categoría</h1>
      <div className="mt-6">
        <BibliotecaCategoriaForm action={updateCategoria.bind(null, categoria.id)} defaultValues={categoria} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
