import { getHomeHero } from "@/lib/home-hero";
import { Card, Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";
import { guardarInicio } from "./actions";

export default async function AdminInicioPage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const { guardado } = await searchParams;
  const h = await getHomeHero();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Portada (inicio)</h1>
      <p className="mt-1 text-sm text-gray-500">Textos del bloque principal de la página de inicio.</p>

      {guardado && (
        <p role="status" className="mt-4 max-w-2xl rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Cambios guardados.
        </p>
      )}

      <div className="mt-6 max-w-2xl">
        <Card title="Bloque principal" hint="El título se divide en dos partes: la segunda se muestra en color destacado.">
          <form action={guardarInicio} className="space-y-4">
            <Field label="Título (primera parte)">
              <TextInput name="tituloInicio" defaultValue={h.tituloInicio} />
            </Field>
            <Field label="Título (parte destacada)">
              <TextInput name="tituloDestacado" defaultValue={h.tituloDestacado} />
            </Field>
            <Field label="Bajada">
              <TextArea rich={false} name="bajada" rows={3} defaultValue={h.bajada} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Texto del botón">
                <TextInput name="botonTexto" defaultValue={h.botonTexto} />
              </Field>
              <Field label="Link del botón">
                <TextInput name="botonHref" defaultValue={h.botonHref} placeholder="/matriculados" />
              </Field>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Estadísticas (dejá vacías las que no quieras mostrar)</p>
              <div className="mt-3 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-2">
                    <TextInput name={`statValor${i}`} placeholder="Valor (ej. +40 años)" defaultValue={h.stats[i - 1]?.valor ?? ""} />
                    <TextInput name={`statEtiqueta${i}`} placeholder="Etiqueta (ej. de compromiso)" defaultValue={h.stats[i - 1]?.etiqueta ?? ""} />
                  </div>
                ))}
              </div>
            </div>

            <SubmitButton>Guardar cambios</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
