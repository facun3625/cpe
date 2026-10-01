import { RichText } from "@/components/rich-text";
import { Accordion } from "@/components/accordion";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";
import { getHero, HEROES } from "@/lib/page-hero";

export const dynamic = "force-dynamic";

const DEFAULTS = HEROES.find((h) => h.key === "institucional-comisiones")!.defaults;

export default async function Page() {
  let comisiones: Awaited<ReturnType<typeof prisma.comision.findMany>> = [];
  try {
    comisiones = await prisma.comision.findMany({ orderBy: { orden: "asc" } });
  } catch {}
  const hero = await getHero("institucional-comisiones", DEFAULTS);

  return (
    <InternalPage
      eyebrow={hero.eyebrow}
      title={hero.titulo}
      intro={hero.intro}
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
