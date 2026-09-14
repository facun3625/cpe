import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AutoridadForm } from "@/components/admin/autoridad-form";
import { updateAutoridad } from "../actions";

export default async function EditarAutoridadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const autoridad = await prisma.autoridad.findUnique({ where: { id } });
  if (!autoridad) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar autoridad</h1>
      <div className="mt-6">
        <AutoridadForm action={updateAutoridad.bind(null, autoridad.id)} defaultValues={autoridad} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
