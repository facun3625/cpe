import { RichText } from "@/components/rich-text";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 shrink-0 text-cpe-coral">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.5V8h4" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14" />
    </svg>
  );
}

export const dynamic = "force-dynamic";

export default async function Page() {
  let dictamenes: Awaited<ReturnType<typeof prisma.documento.findMany>> = [];
  try {
    dictamenes = await prisma.documento.findMany({ where: { tipo: "DICTAMEN" }, orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Documentación"
      title="Dictámenes."
      intro="Dictámenes de la Comisión de Incumbencias Profesionales de la Enfermería sobre alcances y límites del ejercicio."
    >
      <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {dictamenes.map((dictamen) => (
          <div key={dictamen.id} className="flex flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <IconDoc />
              <p className="font-medium leading-6 text-cpe-navy"><RichText value={dictamen.titulo} /></p>
            </div>
            {dictamen.archivoUrl ? (
              <a
                href={dictamen.archivoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cpe-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-cpe-royal sm:ml-4"
              >
                <IconDownload /> Descargar
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Disponible próximamente"
                className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full bg-cpe-bg px-4 py-2 text-xs font-bold text-cpe-navy/40 sm:ml-4"
              >
                <IconDownload /> Descargar
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Los dictámenes completos están disponibles para su consulta en la sede del Colegio. Muy pronto podrás verlos y descargarlos directamente desde acá.
      </p>
    </InternalPage>
  );
}
