import { prisma } from "@/lib/prisma";
import { Field, TextArea, SubmitButton } from "@/components/admin/fields";
import { GaleriaManager } from "@/components/admin/media-inputs";
import { guardarCer } from "./actions";

type CerContenido = { texto: string; galeria: string[] };

export default async function AdminCerPage() {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "centro-educativo-recreativo" } });
  const c = (registro?.contenido as CerContenido | undefined) ?? { texto: "", galeria: [] };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Centro Educativo Recreativo</h1>
      <p className="mt-1 text-sm text-gray-500">Texto y galería de imágenes que se muestran en la página pública del CER.</p>
      <form action={guardarCer} className="mt-6 max-w-2xl space-y-5">
        <Field label="Texto de la página">
          <TextArea name="texto" rows={8} defaultValue={c.texto} />
        </Field>
        <Field label="Galería de imágenes">
          <GaleriaManager nuevasFieldName="galeriaNuevas" ordenFieldName="galeriaOrden" existentes={c.galeria ?? []} />
        </Field>
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>
    </div>
  );
}
