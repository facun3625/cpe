import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

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
              {req}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {documentos.map((doc) =>
            doc.archivoUrl ? (
              <a
                key={doc.id}
                href={doc.archivoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cpe-bg px-5 py-2.5 text-xs font-bold text-cpe-navy transition hover:bg-slate-200"
              >
                <IconDownload /> {doc.titulo}
              </a>
            ) : (
              <button
                key={doc.id}
                type="button"
                disabled
                title="Disponible próximamente"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-cpe-bg px-5 py-2.5 text-xs font-bold text-cpe-navy/40"
              >
                <IconDownload /> {doc.titulo}
              </button>
            )
          )}
          <a
            href="https://cpesag.com.ar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-cpe-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal"
          >
            Iniciar en el SAG ↗
          </a>
        </div>
      </div>
    </InternalPage>
  );
}
