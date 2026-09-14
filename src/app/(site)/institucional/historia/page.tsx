import Image from "next/image";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  let hitos: Awaited<ReturnType<typeof prisma.hitoHistoria.findMany>> = [];
  try {
    hitos = await prisma.hitoHistoria.findMany({ orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Institucional"
      title="Nuestra historia."
      intro="Los hitos que dieron forma a la organización profesional de la enfermería santafesina."
    >
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10">
        <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-3xl border border-slate-200 shadow-sm lg:sticky lg:top-32">
          <Image
            src="/images/sede-santa-fe.jpg"
            alt="Sede del Colegio de Profesionales en Enfermería de Santa Fe"
            width={540}
            height={760}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="relative">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-slate-200 sm:left-[35px]" />
          <div className="space-y-8">
            {hitos.map((hito) => (
              <div key={hito.id} className="relative flex gap-5 sm:gap-8">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cpe-navy px-1 text-center text-[10px] font-bold uppercase leading-tight text-white sm:h-[70px] sm:w-[70px] sm:text-xs">
                  {hito.anio}
                </div>
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
                  <h2 className="text-lg font-bold text-cpe-navy">{hito.titulo}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{hito.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InternalPage>
  );
}
