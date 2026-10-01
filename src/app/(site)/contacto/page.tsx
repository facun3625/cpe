import { InternalPage } from "@/components/internal-page";
import { SedeCard } from "@/components/sede-card";
import { prisma } from "@/lib/prisma";
import { getHero, HEROES } from "@/lib/page-hero";

export const dynamic = "force-dynamic";

const DEFAULTS = HEROES.find((h) => h.key === "contacto")!.defaults;

export default async function Page() {
  let sedes: Awaited<ReturnType<typeof prisma.sede.findMany>> = [];
  try {
    sedes = await prisma.sede.findMany({ orderBy: { orden: "asc" } });
  } catch {}
  const hero = await getHero("contacto", DEFAULTS);

  return (
    <InternalPage
      eyebrow={hero.eyebrow}
      title={hero.titulo}
      intro={hero.intro}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sedes.map((sede) => (
          <SedeCard key={sede.id} sede={sede} variant="light" className="rounded-3xl border border-slate-200 bg-white p-7" />
        ))}
      </div>
    </InternalPage>
  );
}
