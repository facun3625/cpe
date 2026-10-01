import { prisma } from "@/lib/prisma";
import { Card, Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";
import { HEROES, heroPaginaKey, type HeroTexto } from "@/lib/page-hero";
import { guardarHero } from "./actions";

export default async function AdminEncabezadosPage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const { guardado } = await searchParams;
  const registros = await prisma.paginaTexto.findMany({
    where: { pagina: { in: HEROES.map((h) => heroPaginaKey(h.key)) } },
  });
  const porClave = new Map(registros.map((r) => [r.pagina, r.contenido as Partial<HeroTexto>]));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Encabezados de página</h1>
      <p className="mt-1 text-sm text-gray-500">
        Eyebrow, título y bajada que aparecen arriba de cada página pública (sobre fondo navy).
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {HEROES.map((h) => (
          <a key={h.key} href={`#${h.key}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-cpe-royal/40 hover:text-cpe-royal">
            {h.label}
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {HEROES.map((h) => {
          const c = porClave.get(heroPaginaKey(h.key));
          const eyebrow = c?.eyebrow ?? h.defaults.eyebrow;
          const titulo = c?.titulo ?? h.defaults.titulo;
          const intro = c?.intro ?? h.defaults.intro;
          return (
            <div id={h.key} key={h.key} className="scroll-mt-6">
              <Card
                title={h.label}
                action={<a href={h.ruta} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cpe-royal hover:underline">Ver página ↗</a>}
              >
                {guardado === h.key && (
                  <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                    Cambios guardados.
                  </p>
                )}
                <form action={guardarHero} className="space-y-4">
                  <input type="hidden" name="key" value={h.key} />
                  <Field label="Eyebrow (etiqueta pequeña)">
                    <TextInput name="eyebrow" defaultValue={eyebrow} />
                  </Field>
                  <Field label="Título">
                    <TextInput name="titulo" defaultValue={titulo} />
                  </Field>
                  <Field label="Bajada">
                    <TextArea rich={false} name="intro" rows={2} defaultValue={intro} />
                  </Field>
                  <SubmitButton>Guardar cambios</SubmitButton>
                </form>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
