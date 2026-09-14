import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  let items: Awaited<ReturnType<typeof prisma.seccionItem.findMany>> = [];
  try {
    items = await prisma.seccionItem.findMany({ where: { pagina: "actividad-academica" }, orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Actividad académica"
      title="Formación para una profesión que nunca deja de avanzar."
      intro="Cursos, jornadas, encuentros y recursos pensados para actualizar conocimientos y fortalecer la práctica cotidiana."
      items={items.map((i) => ({ title: i.titulo, text: i.texto, href: i.href ?? undefined }))}
    />
  );
}
