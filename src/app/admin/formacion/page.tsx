import { joinRichTextLines } from "@/lib/rich-text";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";
import { guardarPropuestaEducativa } from "./actions";

type PropuestaContenido = { intro: string; parrafos: string[]; firma: string };

export default async function AdminFormacionPage() {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "propuesta-educativa" } });
  const c = (registro?.contenido as PropuestaContenido | undefined) ?? { intro: "", parrafos: [], firma: "" };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Formación</h1>

      <form action={guardarPropuestaEducativa} className="mt-6 max-w-2xl space-y-5">
        <p className="text-sm font-semibold text-gray-900">Propuesta educativa</p>
        <Field label="Bajada corta">
          <TextInput rich name="intro" required defaultValue={c.intro} />
        </Field>
        <Field label="Párrafos (uno por línea)">
          <TextArea name="parrafos" rows={6} defaultValue={joinRichTextLines(c.parrafos)} />
        </Field>
        <Field label="Firma">
          <TextInput rich name="firma" defaultValue={c.firma} />
        </Field>
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/secciones/actividad-academica" className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-lg font-bold text-cpe-navy">Cards de Actividad académica</h3>
          <p className="mt-2 text-sm text-slate-500">Propuesta educativa, Biblioteca, Jornadas, Becas.</p>
        </Link>
        <Link href="/admin/biblioteca" className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-lg font-bold text-cpe-navy">Contenidos de Biblioteca</h3>
          <p className="mt-2 text-sm text-slate-500">Categorías y posts con portada, bajada y PDF descargable.</p>
        </Link>
      </div>
    </div>
  );
}
