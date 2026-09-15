import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SitePopup } from "@/components/site-popup";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let popup: Awaited<ReturnType<typeof prisma.popupConfig.findUnique>> = null;
  try {
    popup = await prisma.popupConfig.findUnique({ where: { id: "global" } });
  } catch {}

  let novedadCategorias: string[] = [];
  try {
    novedadCategorias = (await prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } })).map((c) => c.nombre);
  } catch {}

  return (
    <>
      <SiteHeader novedadCategorias={novedadCategorias} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
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
