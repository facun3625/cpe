import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NovedadForm } from "@/components/admin/novedad-form";
import { updateNovedad } from "../actions";

export default async function EditarNovedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [novedad, categoriasDb] = await Promise.all([
    prisma.novedad.findUnique({
      where: { id },
      include: { archivos: { orderBy: { orden: "asc" } } },
    }),
    prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } }),
  ]);

  if (!novedad) notFound();

  const categorias = categoriasDb.map((c) => c.nombre);
  if (!categorias.includes(novedad.categoria)) categorias.unshift(novedad.categoria);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar novedad</h1>
      <div className="mt-6">
        <NovedadForm
          action={updateNovedad.bind(null, novedad.id)}
          defaultValues={novedad}
          submitLabel="Guardar cambios"
          categorias={categorias}
        />
      </div>
    </div>
  );
}
