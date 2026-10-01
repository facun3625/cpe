import { BibliotecaCatalogo } from "@/components/biblioteca-catalogo";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";
import { getHero, HEROES } from "@/lib/page-hero";
import type { Prisma } from "@prisma/client";

type CategoriaConPosts = Prisma.BibliotecaCategoriaGetPayload<{ include: { posts: true } }>;

export const dynamic = "force-dynamic";

const DEFAULTS = HEROES.find((h) => h.key === "biblioteca")!.defaults;

export default async function Page() {
  let categorias: CategoriaConPosts[] = [];
  try {
    categorias = await prisma.bibliotecaCategoria.findMany({
      orderBy: { orden: "asc" },
      include: { posts: { where: { publicado: true }, orderBy: { orden: "asc" } } },
    });
  } catch {}
  const hero = await getHero("biblioteca", DEFAULTS);

  return (
    <InternalPage
      eyebrow={hero.eyebrow}
      title={hero.titulo}
      intro={hero.intro}
    >
      <BibliotecaCatalogo categorias={categorias} />
    </InternalPage>
  );
}
