import { BibliotecaCatalogo } from "@/components/biblioteca-catalogo";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type CategoriaConPosts = Prisma.BibliotecaCategoriaGetPayload<{ include: { posts: true } }>;

export const dynamic = "force-dynamic";

export default async function Page() {
  let categorias: CategoriaConPosts[] = [];
  try {
    categorias = await prisma.bibliotecaCategoria.findMany({
      orderBy: { orden: "asc" },
      include: { posts: { where: { publicado: true }, orderBy: { orden: "asc" } } },
    });
  } catch {}

  return (
    <InternalPage
      eyebrow="Biblioteca"
      title="Conocimiento al alcance de toda la comunidad profesional."
      intro="Un espacio de consulta con bibliografía especializada y recursos académicos para estudiar, investigar y actualizarse."
    >
      <BibliotecaCatalogo categorias={categorias} />
    </InternalPage>
  );
}
