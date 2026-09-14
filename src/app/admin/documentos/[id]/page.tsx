import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentoForm } from "@/components/admin/documento-form";
import { updateDocumento } from "../actions";

export default async function EditarDocumentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const documento = await prisma.documento.findUnique({ where: { id } });
  if (!documento) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar documento</h1>
      <div className="mt-6">
        <DocumentoForm action={updateDocumento.bind(null, documento.id)} defaultValues={documento} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
