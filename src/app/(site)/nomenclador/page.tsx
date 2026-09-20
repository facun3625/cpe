import { AMBITOS, readNomencladorConfig } from "@/lib/nomenclador/config";
import { InternalPage } from "@/components/internal-page";
import { BuscadorNomenclador } from "@/components/nomenclador/buscador";
import { formatearMoneda } from "@/components/nomenclador/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let items: Awaited<ReturnType<typeof prisma.nomencladorItem.findMany>> = [];
  let config = readNomencladorConfig(null);
  try {
    const [prestaciones, registro] = await prisma.$transaction([
      prisma.nomencladorItem.findMany({ orderBy: { orden: "asc" } }),
      prisma.paginaTexto.findUnique({ where: { pagina: "nomenclador" } }),
    ], { isolationLevel: "RepeatableRead" });
    items = prestaciones;
    config = readNomencladorConfig(registro?.contenido);
  } catch {}

  return (
    <InternalPage
      eyebrow="Aranceles"
      title="Nomenclador de prestaciones."
      intro="Aranceles mínimos sugeridos para las prestaciones de enfermería. Consultá los precios publicados y descargá el nomenclador completo."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AMBITOS.map((v) => (
          <div key={v.key} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-cpe-coral">{v.label}</p>
            <p className="mt-2 text-xl font-bold text-cpe-navy">{formatearMoneda(config.valoresUpe[v.key])}</p>
            <p className="text-xs text-slate-500">por U.P.E.</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href="/api/nomenclador/excel" download className="inline-flex rounded-full bg-cpe-navy px-5 py-3 text-sm font-bold text-white hover:bg-cpe-royal">Descargar Excel ↓</a>
        {config.pdfUrl && <a href={config.pdfUrl} download className="inline-flex rounded-full border border-cpe-navy px-5 py-3 text-sm font-bold text-cpe-navy hover:bg-white">Descargar PDF ↓</a>}
        {config.publicadoEn && <p className="text-xs text-slate-500">Publicación actualizada el {new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeZone: "America/Argentina/Cordoba" }).format(new Date(config.publicadoEn))}</p>}
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

      {config.otrosValores.length > 0 && <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Otros valores de referencia</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {config.otrosValores.map((o) => (
            <div key={o.concepto} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 sm:border-b-0 sm:pb-0">
              <span className="text-sm text-slate-600">{o.concepto}</span>
              <span className="shrink-0 font-bold text-cpe-navy">{formatearMoneda(o.valor)}</span>
            </div>
          ))}
        </div>
      </div>}

      <p className="mt-6 text-xs leading-5 text-slate-500">
        Los aranceles son orientativos y sin insumos; el profesional podrá adaptarlos según su actividad diaria y las características de la comunidad donde realiza la atención. Se actualizan anualmente a partir de febrero de cada año.
      </p>
    </InternalPage>
  );
}
