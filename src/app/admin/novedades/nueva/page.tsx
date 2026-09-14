import { NovedadForm } from "@/components/admin/novedad-form";
import { createNovedad } from "../actions";

export default function NuevaNovedadPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva novedad</h1>
      <div className="mt-6">
        <NovedadForm action={createNovedad} submitLabel="Crear novedad" />
      </div>
    </div>
  );
}
