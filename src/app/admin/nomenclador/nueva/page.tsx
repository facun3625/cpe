import { NomencladorItemForm } from "@/components/admin/nomenclador-item-form";
import { createNomencladorItem } from "../actions";

export default function NuevaPrestacionPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva prestación</h1>
      <div className="mt-6">
        <NomencladorItemForm action={createNomencladorItem} submitLabel="Crear" />
      </div>
    </div>
  );
}
