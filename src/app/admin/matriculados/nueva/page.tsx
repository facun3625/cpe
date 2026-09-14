import { MatriculadoForm } from "@/components/admin/matriculado-form";
import { createMatriculado } from "../actions";

export default function NuevoMatriculadoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo matriculado</h1>
      <div className="mt-6">
        <MatriculadoForm action={createMatriculado} submitLabel="Crear matriculado" />
      </div>
    </div>
  );
}
