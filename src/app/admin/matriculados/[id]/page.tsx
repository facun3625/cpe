import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatriculadoForm } from "@/components/admin/matriculado-form";
import { updateMatriculado } from "../actions";

export default async function EditarMatriculadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matriculado = await prisma.matriculado.findUnique({ where: { id } });
  if (!matriculado) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar matriculado</h1>
      <div className="mt-6">
        <MatriculadoForm action={updateMatriculado.bind(null, matriculado.id)} defaultValues={matriculado} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
