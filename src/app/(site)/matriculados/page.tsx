import { InternalPage } from "@/components/internal-page";
import { BuscadorMatriculados } from "@/components/matriculados/buscador";
import { prisma } from "@/lib/prisma";
import { getHero, HEROES } from "@/lib/page-hero";

export const dynamic = "force-dynamic";

const DEFAULTS = HEROES.find((h) => h.key === "matriculados")!.defaults;

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let matriculados: Awaited<ReturnType<typeof prisma.matriculado.findMany>> = [];
  try {
    matriculados = await prisma.matriculado.findMany({ orderBy: [{ apellido: "asc" }, { nombre: "asc" }] });
  } catch {}
  const hero = await getHero("matriculados", DEFAULTS);

  return (
    <InternalPage
      eyebrow={hero.eyebrow}
      title={hero.titulo}
      intro={hero.intro}
    >
      <BuscadorMatriculados matriculados={matriculados} initialQuery={q} />
      <p className="mt-8 text-sm text-slate-600">
        ¿Necesitás hacer un trámite sobre tu matrícula?{" "}
        <a href="https://cpesag.com.ar" target="_blank" rel="noreferrer" className="font-bold text-cpe-royal hover:underline">
          Ingresá al sistema de autogestión ↗
        </a>
      </p>
    </InternalPage>
  );
}
