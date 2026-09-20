import { RichText } from "@/components/rich-text";
import { Accordion } from "@/components/accordion";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  let comisiones: Awaited<ReturnType<typeof prisma.comision.findMany>> = [];
  try {
    comisiones = await prisma.comision.findMany({ orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Institucional"
      title="Comisiones."
      intro="Equipos de trabajo que abordan temas académicos, éticos, legales y profesionales del ejercicio de la enfermería."
    >
      <Accordion
        items={comisiones.map((comision) => ({
          title: comision.titulo,
          content: (
            <>
              <p><RichText value={comision.texto} /></p>
              {comision.tramitesRelacionados.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-cpe-coral">Trámites relacionados</p>
                  <ul className="mt-3 space-y-2">
                    {comision.tramitesRelacionados.map((tramite) => (
                      <li key={tramite} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cpe-navy/40" aria-hidden />
                        <RichText value={tramite} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ),
        }))}
      />
    </InternalPage>
  );
}
