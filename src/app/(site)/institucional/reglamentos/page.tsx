import { Accordion } from "@/components/accordion";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-cpe-navy/40">
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
  let documentos: Awaited<ReturnType<typeof prisma.documento.findMany>> = [];
  try {
    documentos = await prisma.documento.findMany({ where: { tipo: "REGLAMENTO" }, orderBy: { orden: "asc" } });
  } catch {}

  const grupos = Array.from(new Set(documentos.map((d) => d.grupo ?? "Documentos")));

  return (
    <InternalPage
      eyebrow="Institucional"
      title="Reglamentos."
      intro="Normativa institucional, código de ética, resoluciones y documentación de consulta."
    >
      <Accordion
        items={grupos.map((grupo) => ({
          title: grupo,
          content: (
            <ul className="space-y-3">
              {documentos.filter((d) => (d.grupo ?? "Documentos") === grupo).map((doc) => (
                <li key={doc.id} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <IconDoc />
                    <span className="font-medium text-cpe-navy">{doc.titulo}</span>
                  </div>
                  {doc.archivoUrl ? (
                    <a
                      href={doc.archivoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cpe-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-cpe-royal"
                    >
                      <IconDownload /> Descargar
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="Disponible próximamente"
                      className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full bg-cpe-bg px-4 py-2 text-xs font-bold text-cpe-navy/40"
                    >
                      <IconDownload /> Descargar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ),
        }))}
      />
      <p className="mt-6 text-xs text-slate-500">
        Los documentos completos están disponibles para su consulta en la sede del Colegio. Muy pronto podrás descargarlos directamente desde acá.
      </p>
    </InternalPage>
  );
}
