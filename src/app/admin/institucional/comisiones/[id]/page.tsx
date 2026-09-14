import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ComisionForm } from "@/components/admin/comision-form";
import { updateComision } from "../actions";

export default async function EditarComisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comision = await prisma.comision.findUnique({ where: { id } });
  if (!comision) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar comisión</h1>
      <div className="mt-6">
        <ComisionForm action={updateComision.bind(null, comision.id)} defaultValues={comision} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
