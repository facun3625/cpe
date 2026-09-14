import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SeccionItemForm } from "@/components/admin/seccion-item-form";
import { updateSeccionItem } from "../../actions";

export default async function EditarSeccionItemPage({ params }: { params: Promise<{ pagina: string; id: string }> }) {
  const { pagina, id } = await params;
  const item = await prisma.seccionItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar card</h1>
      <div className="mt-6">
        <SeccionItemForm action={updateSeccionItem.bind(null, item.id, pagina)} defaultValues={item} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
