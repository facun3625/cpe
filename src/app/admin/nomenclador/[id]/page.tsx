import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NomencladorItemForm } from "@/components/admin/nomenclador-item-form";
import { updateNomencladorItem } from "../actions";

export default async function EditarPrestacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.nomencladorItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar prestación</h1>
      <div className="mt-6">
        <NomencladorItemForm action={updateNomencladorItem.bind(null, item.id)} defaultValues={item} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
