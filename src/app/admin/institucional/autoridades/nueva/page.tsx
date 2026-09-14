import { AutoridadForm } from "@/components/admin/autoridad-form";
import { createAutoridad } from "../actions";

export default function NuevaAutoridadPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva autoridad</h1>
      <div className="mt-6">
        <AutoridadForm action={createAutoridad} submitLabel="Crear" />
      </div>
    </div>
  );
}
