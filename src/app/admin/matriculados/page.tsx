import { prisma } from "@/lib/prisma";
import { AdminTable, NewButton, PageHeader, RowActions } from "@/components/admin/fields";
import { ImportarExcelForm } from "@/components/admin/importar-excel-form";
import { deleteMatriculado, importarMatriculadosExcel } from "./actions";

const NIVEL_LABELS: Record<string, string> = {
  ENFERMERO: "Enfermero/a",
  LICENCIADO: "Lic. en Enfermería",
  AUXILIAR: "Aux. de Enfermería",
};

export default async function AdminMatriculadosPage() {
  const matriculados = await prisma.matriculado.findMany({ orderBy: [{ apellido: "asc" }, { nombre: "asc" }] });

  return (
    <div>
      <PageHeader title="Matriculados" action={<NewButton href="/admin/matriculados/nueva">+ Nuevo matriculado</NewButton>} />

      <div className="mt-6">
        <ImportarExcelForm action={importarMatriculadosExcel} />
      </div>

      <AdminTable head={["Apellido y nombre", "DNI", "Matrícula", "Nivel"]} empty={matriculados.length === 0 ? "Todavía no hay matriculados cargados." : undefined}>
        {matriculados.map((m) => (
          <tr key={m.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{m.apellido}, {m.nombre}</td>
            <td className="px-4 py-3 text-gray-600">{m.dni}</td>
            <td className="px-4 py-3 text-gray-600">{m.matricula}</td>
            <td className="px-4 py-3 text-gray-600">{NIVEL_LABELS[m.nivel]}</td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/matriculados/${m.id}`} deleteAction={deleteMatriculado.bind(null, m.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
