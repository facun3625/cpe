import { InternalPage } from "@/components/internal-page";
import { BuscadorMatriculados } from "@/components/matriculados/buscador";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let matriculados: Awaited<ReturnType<typeof prisma.matriculado.findMany>> = [];
  try {
    matriculados = await prisma.matriculado.findMany({ orderBy: [{ apellido: "asc" }, { nombre: "asc" }] });
  } catch {}

  return (
    <InternalPage
      eyebrow="Matrícula profesional"
      title="Matriculados activos."
      intro="Consultá el padrón de profesionales matriculados en el Colegio: enfermeros, licenciados y auxiliares de enfermería de toda la provincia."
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
