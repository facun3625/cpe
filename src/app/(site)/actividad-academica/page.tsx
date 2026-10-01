import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";
import { getHero, HEROES } from "@/lib/page-hero";

export const dynamic = "force-dynamic";

const DEFAULTS = HEROES.find((h) => h.key === "actividad-academica")!.defaults;

export default async function Page() {
  let items: Awaited<ReturnType<typeof prisma.seccionItem.findMany>> = [];
  try {
    items = await prisma.seccionItem.findMany({ where: { pagina: "actividad-academica" }, orderBy: { orden: "asc" } });
  } catch {}
  const hero = await getHero("actividad-academica", DEFAULTS);

  return (
    <InternalPage
      eyebrow={hero.eyebrow}
      title={hero.titulo}
      intro={hero.intro}
      items={items.map((i) => ({ title: i.titulo, text: i.texto, href: i.href ?? undefined }))}
    />
  );
}
