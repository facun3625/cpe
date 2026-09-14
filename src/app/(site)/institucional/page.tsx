import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  let items: Awaited<ReturnType<typeof prisma.seccionItem.findMany>> = [];
  try {
    items = await prisma.seccionItem.findMany({ where: { pagina: "institucional" }, orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Institucional"
      title="Una institución construida para acompañar."
      intro="El Colegio regula el ejercicio profesional, representa a la comunidad de enfermería y promueve su desarrollo en toda la provincia de Santa Fe."
      items={items.map((i) => ({ title: i.titulo, text: i.texto, href: i.href ?? undefined }))}
    />
  );
}
