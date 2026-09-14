import { Accordion } from "@/components/accordion";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14" />
    </svg>
  );
}

export const dynamic = "force-dynamic";

export default async function Page() {
  let tramites: Awaited<ReturnType<typeof prisma.tramite.findMany>> = [];
  let notasModelo: Awaited<ReturnType<typeof prisma.documento.findMany>> = [];
  try {
    [tramites, notasModelo] = await Promise.all([
      prisma.tramite.findMany({ orderBy: { orden: "asc" } }),
      prisma.documento.findMany({ where: { tipo: "NOTA_MODELO" } }),
    ]);
  } catch {}

  return (
    <InternalPage
      eyebrow="Trámites"
      title="Resolver tus gestiones tiene que ser simple."
      intro="Requisitos para las principales gestiones vinculadas con tu matrícula profesional. Todos los trámites se inician a través del SAG (Sistema de Autogestión)."
      aside="Antes de iniciar una gestión, verificá que tengas las cuotas de mantenimiento al día y la documentación digitalizada con claridad."
    >
      <Accordion
        items={tramites.map((tramite) => {
          const notaModelo = notasModelo.find((d) => d.grupo === tramite.slug);
          return {
            title: tramite.titulo,
            content: (
              <>
                <p>{tramite.texto}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-cpe-coral">Requisitos</p>
                <ul className="mt-3 space-y-2">
                  {tramite.requisitos.map((req) => (
                    <li key={req} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cpe-navy/40" aria-hidden />
                      {req}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://cpesag.com.ar"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-cpe-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal"
                  >
                    Iniciar en el SAG ↗
                  </a>
                  {notaModelo && (
                    notaModelo.archivoUrl ? (
                      <a
                        href={notaModelo.archivoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-cpe-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal"
                      >
                        <IconDownload /> Descargar nota modelo
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Disponible próximamente"
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-cpe-bg px-5 py-2.5 text-xs font-bold text-cpe-navy/40"
                      >
                        <IconDownload /> Descargar nota modelo
                      </button>
                    )
                  )}
                </div>
              </>
            ),
          };
        })}
      />
    </InternalPage>
  );
}
