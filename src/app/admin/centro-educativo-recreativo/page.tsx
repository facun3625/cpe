import { prisma } from "@/lib/prisma";
import { Field, TextArea, TextInput, SubmitButton } from "@/components/admin/fields";
import { GaleriaManager } from "@/components/admin/media-inputs";
import { guardarCer } from "./actions";

type CerContenido = { texto: string; galeria: string[]; whatsapp?: string };

export default async function AdminCerPage() {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "centro-educativo-recreativo" } });
  const c = (registro?.contenido as CerContenido | undefined) ?? { texto: "", galeria: [], whatsapp: "" };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Centro Educativo Recreativo</h1>
      <p className="mt-1 text-sm text-gray-500">Texto, galería de imágenes y contacto por WhatsApp que se muestran en la página pública del CER.</p>
      <form action={guardarCer} className="mt-6 max-w-2xl space-y-5">
        <Field label="Texto de la página">
          <TextArea name="texto" rows={8} defaultValue={c.texto} />
        </Field>
        <Field label="Galería de imágenes">
          <GaleriaManager nuevasFieldName="galeriaNuevas" ordenFieldName="galeriaOrden" existentes={c.galeria ?? []} />
        </Field>
        <Field label="WhatsApp para consultas sobre el predio" hint="Número con código de país, sin espacios ni guiones. Ej: 5493425551234. Dejalo vacío para no mostrar el botón.">
          <TextInput name="whatsapp" type="tel" placeholder="5493425551234" defaultValue={c.whatsapp ?? ""} />
        </Field>
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>
    </div>
  );
}
