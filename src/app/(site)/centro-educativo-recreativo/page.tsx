import { InternalPage } from "@/components/internal-page";
import { RichText } from "@/components/rich-text";
import { NovedadGaleria } from "@/components/novedad-galeria";
import { prisma } from "@/lib/prisma";

type CerContenido = { texto: string; galeria: string[]; whatsapp?: string };

export const dynamic = "force-dynamic";

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm5.78 14.07c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11a16 16 0 0 1-1.62-.6c-2.86-1.24-4.72-4.13-4.87-4.32-.14-.2-1.17-1.55-1.17-2.96s.73-2.1 1-2.39c.26-.29.57-.36.76-.36h.55c.18 0 .42-.03.65.5.24.55.82 1.9.89 2.04.07.14.11.31.02.5-.09.2-.13.31-.27.48-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.29.71 1.18 1.53 1.91 1.05.94 1.94 1.24 2.23 1.38.29.14.46.12.63-.07.18-.19.75-.87.95-1.17.2-.29.4-.24.67-.14.27.09 1.72.81 2.02.96.29.14.49.21.56.34.07.13.07.75-.17 1.42Z" />
    </svg>
  );
}

export default async function Page() {
  let contenido: CerContenido = { texto: "", galeria: [], whatsapp: "" };
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

      {contenido.whatsapp && (
        <a
          href={`https://wa.me/${contenido.whatsapp}?text=${encodeURIComponent("Hola, quiero consultar sobre el Centro Educativo Recreativo (CER).")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
        >
          <IconWhatsapp /> Consultar por WhatsApp
        </a>
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
