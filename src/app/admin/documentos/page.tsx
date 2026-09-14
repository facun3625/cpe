import { prisma } from "@/lib/prisma";
import { PageHeader, NewButton } from "@/components/admin/fields";
import { DocumentosBuscador } from "@/components/admin/documentos-buscador";
import { deleteDocumento } from "./actions";

export default async function AdminDocumentosPage() {
  const documentos = await prisma.documento.findMany({ orderBy: [{ tipo: "asc" }, { orden: "asc" }] });

  return (
    <div>
      <PageHeader title="Documentos" action={<NewButton href="/admin/documentos/nueva">+ Nuevo documento</NewButton>} />
      <div className="mt-6">
        <DocumentosBuscador documentos={documentos} deleteAction={deleteDocumento} />
      </div>
    </div>
  );
}
