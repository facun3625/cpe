import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NovedadCategoriaForm } from "@/components/admin/novedad-categoria-form";
import { updateCategoria } from "../actions";

export default async function EditarCategoriaNovedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoria = await prisma.novedadCategoria.findUnique({ where: { id } });

  if (!categoria) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar categoría</h1>
      <div className="mt-6">
        <NovedadCategoriaForm action={updateCategoria.bind(null, categoria.id)} defaultValues={categoria} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
