import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { deleteUsuario } from "./actions";

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default async function AdminUsuariosPage() {
  const [usuarios, session] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    auth(),
  ]);

  return (
    <div>
      <PageHeader title="Usuarios administradores" action={<NewButton href="/admin/usuarios/nueva">+ Nuevo usuario</NewButton>} />
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Cualquier usuario acá listado puede ingresar al panel de administración con acceso completo.
      </p>
      <AdminTable head={["Nombre", "Email", "Creado"]} empty={usuarios.length === 0 ? "Todavía no hay usuarios cargados." : undefined}>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{u.name || "—"}</td>
            <td className="px-4 py-3 text-gray-600">
              {u.email}
              {u.id === session?.user?.id && <span className="ml-2 rounded-full bg-cpe-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cpe-navy">Vos</span>}
            </td>
            <td className="px-4 py-3 text-gray-600">{formatFecha(u.createdAt)}</td>
            <td className="px-4 py-3 text-right">
              {u.id === session?.user?.id || usuarios.length <= 1 ? (
                <a href={`/admin/usuarios/${u.id}`} className="text-sm font-medium text-cpe-blue hover:underline">Editar</a>
              ) : (
                <RowActions
                  editHref={`/admin/usuarios/${u.id}`}
                  deleteAction={deleteUsuario.bind(null, u.id)}
                  confirmMessage={`¿Eliminar el usuario ${u.email}? Esta acción no se puede deshacer.`}
                />
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
