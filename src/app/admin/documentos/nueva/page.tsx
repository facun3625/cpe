import { DocumentoForm } from "@/components/admin/documento-form";
import { createDocumento } from "../actions";

export default function NuevoDocumentoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo documento</h1>
      <div className="mt-6">
        <DocumentoForm action={createDocumento} submitLabel="Crear documento" />
      </div>
    </div>
  );
}
