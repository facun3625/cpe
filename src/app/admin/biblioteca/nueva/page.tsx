import { BibliotecaNav } from "@/components/admin/biblioteca-nav";
import { BibliotecaCategoriaForm } from "@/components/admin/biblioteca-categoria-form";
import { createCategoria } from "../actions";

export default function NuevaCategoriaPage() {
  return (
    <div>
      <BibliotecaNav active="categorias" />
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">Nueva categoría</h1>
      <div className="mt-6">
        <BibliotecaCategoriaForm action={createCategoria} submitLabel="Crear categoría" />
      </div>
    </div>
  );
}
