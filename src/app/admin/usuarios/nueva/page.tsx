import { UsuarioForm } from "@/components/admin/usuario-form";
import { createUsuario } from "../actions";

export default function NuevoUsuarioPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo usuario</h1>
      <div className="mt-6">
        <UsuarioForm action={createUsuario} submitLabel="Crear usuario" />
      </div>
    </div>
  );
}
