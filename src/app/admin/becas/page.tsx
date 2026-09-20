import { plainText } from "@/lib/rich-text";
import { joinRichTextLines } from "@/lib/rich-text";
import { prisma } from "@/lib/prisma";
import { Field, TextArea, SubmitButton } from "@/components/admin/fields";
import { guardarBecas } from "./actions";

type BecasContenido = { requisitos: string[] };

export default async function AdminBecasPage() {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "becas" } });
  const requisitos = (registro?.contenido as BecasContenido | undefined)?.requisitos ?? [];
  const documentos = await prisma.documento.findMany({ where: { tipo: "BECA" }, orderBy: { orden: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Becas</h1>

      <form action={guardarBecas} className="mt-6 max-w-2xl space-y-5">
        <Field label="Requisitos para solicitar una beca (uno por línea)">
          <TextArea name="requisitos" rows={5} defaultValue={joinRichTextLines(requisitos)} />
        </Field>
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>

      <div className="mt-10">
        <p className="text-sm font-semibold text-gray-900">Documentos de becas</p>
        <p className="mt-1 text-xs text-slate-500">El «Reglamento de becas» y el «Formulario de solicitud» se cargan como Documentos con tipo «Beca».</p>
        <ul className="mt-3 space-y-2">
          {documentos.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 text-sm">
              <span>{plainText(d.titulo)}</span>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.archivoUrl ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {d.archivoUrl ? "Cargado" : "Pendiente"}
                </span>
                <a href={`/admin/documentos/${d.id}`} className="font-medium text-cpe-blue hover:underline">Editar</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
