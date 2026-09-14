import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SedeForm } from "@/components/admin/sede-form";
import { updateSede } from "../actions";

export default async function EditarSedePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sede = await prisma.sede.findUnique({ where: { id } });
  if (!sede) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar sede</h1>
      <div className="mt-6">
        <SedeForm action={updateSede.bind(null, sede.id)} defaultValues={sede} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
