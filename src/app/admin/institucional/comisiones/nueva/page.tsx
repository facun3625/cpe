import { ComisionForm } from "@/components/admin/comision-form";
import { createComision } from "../actions";

export default function NuevaComisionPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva comisión</h1>
      <div className="mt-6">
        <ComisionForm action={createComision} submitLabel="Crear" />
      </div>
    </div>
  );
}
