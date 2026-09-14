import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TramiteForm } from "@/components/admin/tramite-form";
import { updateTramite } from "../actions";

export default async function EditarTramitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tramite = await prisma.tramite.findUnique({ where: { id } });
  if (!tramite) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar trámite</h1>
      <div className="mt-6">
        <TramiteForm action={updateTramite.bind(null, tramite.id)} defaultValues={tramite} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
