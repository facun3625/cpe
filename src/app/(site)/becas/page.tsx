import { RichText } from "@/components/rich-text";
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

type BecasContenido = { requisitos: string[] };

export const dynamic = "force-dynamic";

export default async function Page() {
  let requisitos: string[] = [];
  let documentos: Awaited<ReturnType<typeof prisma.documento.findMany>> = [];
  try {
    const [pagina, docs] = await Promise.all([
      prisma.paginaTexto.findUnique({ where: { pagina: "becas" } }),
      prisma.documento.findMany({ where: { tipo: "BECA" }, orderBy: { orden: "asc" } }),
    ]);
    requisitos = (pagina?.contenido as BecasContenido | undefined)?.requisitos ?? [];
    documentos = docs;
  } catch {}

  return (
    <InternalPage
      eyebrow="Becas"
      title="Más oportunidades para seguir creciendo."
      intro="Apoyo económico para que los matriculados puedan participar en cursos, jornadas y eventos de formación profesional."
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Requisitos para solicitar una beca</p>
        <ul className="mt-5 space-y-3">
          {requisitos.map((req) => (
            <li key={req} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cpe-navy/40" aria-hidden />
              <RichText value={req} />
            </li>
          ))}
        </ul>

        {documentos.length > 0 && (
          <ul className="mt-8 space-y-3 border-t border-slate-100 pt-6">
            {documentos.map((doc) => (
              <li key={doc.id} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <IconDoc />
                  <span className="font-medium text-cpe-navy"><RichText value={doc.titulo} /></span>
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
        )}

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-cpe-bg px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-cpe-navy">¿Ya cumplís los requisitos?</p>
            <p className="mt-1 text-sm text-slate-500">Iniciá tu solicitud desde el Sistema de Autogestión (SAG).</p>
          </div>
          <a
            href="https://cpesag.com.ar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-cpe-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal"
          >
            Iniciar en el SAG ↗
          </a>
        </div>
      </div>
    </InternalPage>
  );
}
