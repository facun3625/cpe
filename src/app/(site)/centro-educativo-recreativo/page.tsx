import { InternalPage } from "@/components/internal-page";
import { RichText } from "@/components/rich-text";
import { NovedadGaleria } from "@/components/novedad-galeria";
import { prisma } from "@/lib/prisma";

type CerContenido = { texto: string; galeria: string[] };

export const dynamic = "force-dynamic";

export default async function Page() {
  let contenido: CerContenido = { texto: "", galeria: [] };
  try {
    const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "centro-educativo-recreativo" } });
    if (registro) contenido = registro.contenido as CerContenido;
  } catch {}

  return (
    <InternalPage
      eyebrow="Centro Educativo Recreativo"
      title="Un espacio pensado para formarnos y encontrarnos."
      intro="Conocé el Centro Educativo Recreativo (CER) del Colegio, un espacio para la capacitación y el encuentro de los matriculados."
    >
      {contenido.texto && (
        <div className="rounded-3xl border border-slate-200 bg-white p-7 leading-7 text-slate-700 sm:p-8">
          <RichText value={contenido.texto} />
        </div>
      )}

      {(contenido.galeria?.length ?? 0) > 0 && (
        <div className="mt-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Galería</p>
          <NovedadGaleria imagenes={contenido.galeria} />
        </div>
      )}
    </InternalPage>
  );
}
