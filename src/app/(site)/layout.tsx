import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SitePopup } from "@/components/site-popup";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let popup: Awaited<ReturnType<typeof prisma.popupConfig.findUnique>> = null;
  try {
    popup = await prisma.popupConfig.findUnique({ where: { id: "global" } });
  } catch {}

  return (
    <>
      <SiteHeader />
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
