import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNovedad } from "./actions";

export default async function AdminNovedadesPage() {
  const novedades = await prisma.novedad.findMany({
    orderBy: { publicadoEn: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Novedades</h1>
        <Link
          href="/admin/novedades/nueva"
          className="rounded-md bg-cpe-navy px-4 py-2 text-sm font-semibold text-white hover:bg-cpe-navy-light"
        >
          + Nueva novedad
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {novedades.map((novedad) => (
              <tr key={novedad.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {novedad.titulo}
                </td>
                <td className="px-4 py-3 text-gray-600">{novedad.categoria}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Intl.DateTimeFormat("es-AR").format(novedad.publicadoEn)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      novedad.publicada
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {novedad.publicada ? "Publicada" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/novedades/${novedad.id}`}
                      className="text-sm font-medium text-cpe-blue hover:underline"
                    >
                      Editar
                    </Link>
                    <form action={deleteNovedad.bind(null, novedad.id)}>
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {novedades.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Todavía no hay novedades cargadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
