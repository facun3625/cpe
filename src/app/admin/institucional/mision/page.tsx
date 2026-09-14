import { prisma } from "@/lib/prisma";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";
import { InstitucionalNav } from "@/components/admin/institucional-nav";
import { guardarMision } from "./actions";

type MisionContenido = {
  misionTitulo: string;
  misionTexto: string;
  visionTitulo: string;
  visionTexto: string;
  propositos: string[];
};

export default async function AdminMisionPage() {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "mision" } });
  const c = (registro?.contenido as MisionContenido | undefined) ?? {
    misionTitulo: "", misionTexto: "", visionTitulo: "", visionTexto: "", propositos: [],
  };

  return (
    <div>
      <InstitucionalNav active="mision" />
      <h1 className="text-2xl font-semibold text-gray-900">Misión y visión</h1>
      <form action={guardarMision} className="mt-6 max-w-2xl space-y-5">
        <Field label="Misión — título/frase principal">
          <TextArea name="misionTitulo" rows={2} required defaultValue={c.misionTitulo} />
        </Field>
        <Field label="Misión — texto complementario">
          <TextArea name="misionTexto" rows={3} defaultValue={c.misionTexto} />
        </Field>
        <Field label="Visión — título/frase principal">
          <TextArea name="visionTitulo" rows={2} required defaultValue={c.visionTitulo} />
        </Field>
        <Field label="Visión — texto complementario">
          <TextArea name="visionTexto" rows={3} defaultValue={c.visionTexto} />
        </Field>
        <Field label="Propósitos (uno por línea)">
          <TextArea name="propositos" rows={5} defaultValue={c.propositos.join("\n")} />
        </Field>
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>
    </div>
  );
}
