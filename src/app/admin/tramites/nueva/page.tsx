import { TramiteForm } from "@/components/admin/tramite-form";
import { createTramite } from "../actions";

export default function NuevoTramitePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo trámite</h1>
      <div className="mt-6">
        <TramiteForm action={createTramite} submitLabel="Crear" />
      </div>
    </div>
  );
}
