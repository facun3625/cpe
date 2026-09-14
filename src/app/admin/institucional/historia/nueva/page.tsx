import { HitoForm } from "@/components/admin/hito-form";
import { createHito } from "../actions";

export default function NuevoHitoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo hito</h1>
      <div className="mt-6">
        <HitoForm action={createHito} submitLabel="Crear" />
      </div>
    </div>
  );
}
