import { prisma } from "@/lib/prisma";
import { AdminTable, PageHeader, RowActions } from "@/components/admin/fields";
import { deleteSuscriptor } from "./actions";

export default async function AdminSuscriptoresPage() {
  const suscriptores = await prisma.suscriptor.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Suscriptos al newsletter"
        action={<a href="/api/admin/suscriptores-csv" className="rounded-md bg-cpe-navy px-4 py-2 text-sm font-semibold text-white hover:bg-cpe-navy-light">Descargar CSV</a>}
      />
      <p className="mt-2 text-sm text-slate-500">{suscriptores.length} suscriptos en total.</p>
      <AdminTable head={["Email", "Fecha de alta"]} empty={suscriptores.length === 0 ? "Todavía no hay suscriptos." : undefined}>
        {suscriptores.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{s.email}</td>
            <td className="px-4 py-3 text-gray-600">{new Intl.DateTimeFormat("es-AR").format(s.createdAt)}</td>
            <td className="px-4 py-3 text-right">
              <RowActions deleteAction={deleteSuscriptor.bind(null, s.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
