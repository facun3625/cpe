import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SitePopup } from "@/components/site-popup";
import { prisma } from "@/lib/prisma";
import type { RedesSociales } from "@/components/social-links";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let popup: Awaited<ReturnType<typeof prisma.popupConfig.findUnique>> = null;
  try {
    popup = await prisma.popupConfig.findUnique({ where: { id: "global" } });
  } catch {}

  let novedadCategorias: string[] = [];
  try {
    novedadCategorias = (await prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } })).map((c) => c.nombre);
  } catch {}

  let redes: RedesSociales = {};
  try {
    const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "redes-sociales" } });
    if (registro) redes = registro.contenido as RedesSociales;
  } catch {}

  return (
    <>
      <SiteHeader novedadCategorias={novedadCategorias} redes={redes} />
      <main className="flex-1">{children}</main>
      <SiteFooter redes={redes} />
      {popup && (
        <SitePopup
          activo={popup.activo}
          tipo={popup.tipo}
          titulo={popup.titulo}
          texto={popup.texto}
          imagenUrl={popup.imagenUrl}
          videoUrl={popup.videoUrl}
          mostrarSiempre={popup.mostrarSiempre}
        />
      )}
    </>
  );
}
