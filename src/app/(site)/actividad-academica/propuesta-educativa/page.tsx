import { RichText } from "@/components/rich-text";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

type PropuestaContenido = { intro: string; parrafos: string[]; firma: string };

export const dynamic = "force-dynamic";

export default async function Page() {
  let contenido: PropuestaContenido | null = null;
  try {
    const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "propuesta-educativa" } });
    contenido = (registro?.contenido as PropuestaContenido) ?? null;
  } catch {}

  return (
    <InternalPage
      eyebrow="Actividad académica"
      title="Propuesta educativa."
      intro={contenido?.intro ?? ""}
    >
      <div className="rounded-3xl bg-cpe-navy p-8 text-white sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-mint">Comisión de Capacitación y Actividades Académicas</p>
        <div className="mt-6 space-y-5 text-lg font-medium leading-8 text-white/85">
          {contenido?.parrafos.map((parrafo) => <p key={parrafo}><RichText value={parrafo} /></p>)}
        </div>
        {contenido?.firma && <p className="mt-8 text-sm font-semibold italic text-white/60">— <RichText value={contenido.firma} /></p>}
      </div>
    </InternalPage>
  );
}
