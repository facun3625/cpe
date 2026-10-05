import { getHomeHero } from "@/lib/home-hero";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";
import { guardarInicio } from "./actions";

export default async function AdminInicioPage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const { guardado } = await searchParams;
  const h = await getHomeHero();

  return (
    <div className="flex flex-col lg:h-[calc(100vh-5rem)]">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Portada (inicio)</h1>
          <p className="text-xs text-gray-500">Bloque principal de la página de inicio.</p>
        </div>
        {guardado && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">Cambios guardados.</p>}
      </div>

      <form action={guardarInicio} className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-cpe-royal">Título</p>
          <Field label="Primera parte">
            <TextInput name="tituloInicio" defaultValue={h.tituloInicio} />
          </Field>
          <Field label="Parte destacada (en color)">
            <TextInput name="tituloDestacado" defaultValue={h.tituloDestacado} />
          </Field>
          <Field label="Bajada">
            <TextArea rich={false} name="bajada" rows={4} defaultValue={h.bajada} />
          </Field>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-cpe-royal">Botón</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Texto">
              <TextInput name="botonTexto" defaultValue={h.botonTexto} />
            </Field>
            <Field label="Link">
              <TextInput name="botonHref" defaultValue={h.botonHref} placeholder="/matriculados" />
            </Field>
          </div>

          <p className="pt-1 text-[11px] font-bold uppercase tracking-widest text-cpe-royal">Estadísticas (opcional)</p>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="contents">
                <TextInput name={`statValor${i}`} placeholder={`Valor ${i}`} defaultValue={h.stats[i - 1]?.valor ?? ""} />
                <TextInput name={`statEtiqueta${i}`} placeholder={`Etiqueta ${i}`} defaultValue={h.stats[i - 1]?.etiqueta ?? ""} />
              </div>
            ))}
          </div>

          <div className="mt-auto pt-2">
            <SubmitButton>Guardar cambios</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
