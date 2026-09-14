import { SedeForm } from "@/components/admin/sede-form";
import { createSede } from "../actions";

export default function NuevaSedePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva sede</h1>
      <div className="mt-6">
        <SedeForm action={createSede} submitLabel="Crear" />
      </div>
    </div>
  );
}
