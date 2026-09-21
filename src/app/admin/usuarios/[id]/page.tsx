import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsuarioForm } from "@/components/admin/usuario-form";
import { updateUsuario } from "../actions";

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await prisma.user.findUnique({ where: { id } });
  if (!usuario) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Editar usuario</h1>
      <div className="mt-6">
        <UsuarioForm action={updateUsuario.bind(null, usuario.id)} defaultValues={usuario} submitLabel="Guardar cambios" esEdicion />
      </div>
    </div>
  );
}
