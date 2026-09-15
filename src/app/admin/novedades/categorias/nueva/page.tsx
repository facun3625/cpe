import { NovedadCategoriaForm } from "@/components/admin/novedad-categoria-form";
import { createCategoria } from "../actions";

export default function NuevaCategoriaNovedadPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva categoría</h1>
      <div className="mt-6">
        <NovedadCategoriaForm action={createCategoria} submitLabel="Crear categoría" />
      </div>
    </div>
  );
}
