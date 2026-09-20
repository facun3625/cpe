import { RichText } from "@/components/rich-text";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

type MisionContenido = {
  misionTitulo: string;
  misionTexto: string;
  visionTitulo: string;
  visionTexto: string;
  propositos: string[];
};

const DEFAULT: MisionContenido = {
  misionTitulo: "",
  misionTexto: "",
  visionTitulo: "",
  visionTexto: "",
  propositos: [],
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "mision" } }).catch(() => null);
  const contenido = (registro?.contenido as MisionContenido | undefined) ?? DEFAULT;

  return (
    <InternalPage
      eyebrow="Institucional"
      title="Misión y visión."
      intro="Los principios que guían al Colegio en la representación, el acompañamiento y el desarrollo de la enfermería santafesina."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-cpe-navy p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-mint">Misión</p>
          <p className="mt-6 text-xl font-semibold leading-8 sm:text-2xl"><RichText value={contenido.misionTitulo} /></p>
          <p className="mt-5 leading-7 text-white/70"><RichText value={contenido.misionTexto} /></p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-coral">Visión</p>
          <p className="mt-6 text-xl font-semibold leading-8 text-cpe-navy sm:text-2xl"><RichText value={contenido.visionTitulo} /></p>
          <p className="mt-5 leading-7 text-slate-600"><RichText value={contenido.visionTexto} /></p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-coral">Propósitos</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {contenido.propositos.map((proposito, index) => (
            <div key={proposito} className="rounded-2xl bg-cpe-bg p-5">
              <span className="text-xs font-bold text-cpe-navy/40">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-sm font-semibold leading-5 text-cpe-navy"><RichText value={proposito} /></p>
            </div>
          ))}
        </div>
      </div>
    </InternalPage>
  );
}
