import { InternalPage } from "@/components/internal-page";
import { BuscadorNomenclador } from "@/components/nomenclador/buscador";
import { VALORES_UPE, OTROS_VALORES, formatearMoneda } from "@/components/nomenclador/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let items: Awaited<ReturnType<typeof prisma.nomencladorItem.findMany>> = [];
  try {
    items = await prisma.nomencladorItem.findMany({ orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Aranceles"
      title="Nomenclador de prestaciones."
      intro="Aranceles mínimos sugeridos para las prestaciones de enfermería, actualizados en agosto de 2026 por la Comisión de Actualización Permanente del Nomenclador de Aranceles."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALORES_UPE.map((v) => (
          <div key={v.ambito} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-cpe-coral">{v.ambito}</p>
            <p className="mt-2 text-xl font-bold text-cpe-navy">{formatearMoneda(v.valor)}</p>
            <p className="text-xs text-slate-500">por U.P.E.</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-cpe-navy">Buscar una prestación</h2>
        <p className="mt-1 text-sm text-slate-600">
          Cada actividad de enfermería está cuantificada en minutos y expresada en Unidades de Producción de Enfermería (U.P.E., de 3 minutos cada una).
        </p>
        <div className="mt-5">
          <BuscadorNomenclador items={items} initialQuery={q} />
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Otros valores de referencia</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {OTROS_VALORES.map((o) => (
            <div key={o.concepto} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 sm:border-b-0 sm:pb-0">
              <span className="text-sm text-slate-600">{o.concepto}</span>
              <span className="shrink-0 font-bold text-cpe-navy">{formatearMoneda(o.valor)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs leading-5 text-slate-500">
        Los aranceles son orientativos y sin insumos; el profesional podrá adaptarlos según su actividad diaria y las características de la comunidad donde realiza la atención. Se actualizan anualmente a partir de febrero de cada año.
      </p>
    </InternalPage>
  );
}
