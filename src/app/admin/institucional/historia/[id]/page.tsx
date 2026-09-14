import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HitoForm } from "@/components/admin/hito-form";
import { updateHito } from "../actions";

export default async function EditarHitoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hito = await prisma.hitoHistoria.findUnique({ where: { id } });
  if (!hito) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar hito</h1>
      <div className="mt-6">
        <HitoForm action={updateHito.bind(null, hito.id)} defaultValues={hito} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
