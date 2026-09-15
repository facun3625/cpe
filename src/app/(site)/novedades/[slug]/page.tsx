import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NovedadGaleria } from "@/components/novedad-galeria";
import { CompartirRedes } from "@/components/compartir-redes";
import { getVideoEmbedUrl } from "@/lib/video";

export const dynamic = "force-dynamic";

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14" />
    </svg>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let n = null;
  try {
    n = await prisma.novedad.findUnique({ where: { slug }, include: { archivos: { orderBy: { orden: "asc" } } } });
  } catch {}
  if (!n || !n.publicada) notFound();

  const embedUrl = n.videoUrl ? getVideoEmbedUrl(n.videoUrl) : null;

  return (
    <article className="bg-cpe-bg">
      <header className="bg-cpe-navy py-14 text-white sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <Link href="/novedades" className="text-xs font-bold uppercase tracking-widest text-cpe-mint">← Volver a novedades</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-cpe-gold">{n.categoria}</p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{n.titulo}</h1>
          <p className="mt-5 text-sm text-white/60">{formatFecha(n.publicadoEn)}</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        {n.imagenUrl && (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-lg">
            <Image src={n.imagenUrl} alt="" fill sizes="(min-width: 768px) 700px, 100vw" className="object-cover" />
          </div>
        )}

        <p className="font-display text-2xl leading-9 text-cpe-navy">{n.resumen}</p>

        {n.contenido && (
          <div className="mt-8 space-y-5 leading-7 text-slate-700">
            {n.contenido.split("\n").filter((p) => p.trim()).map((parrafo, i) => <p key={i}>{parrafo}</p>)}
          </div>
        )}

        {embedUrl && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-lg">
            <iframe src={embedUrl} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          </div>
        )}

        {n.galeria.length > 0 && (
          <div className="mt-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Galería</p>
            <NovedadGaleria imagenes={n.galeria} />
          </div>
        )}

        {n.archivos.length > 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Archivos adjuntos</p>
            <ul className="mt-4 space-y-2">
              {n.archivos.map((a) => (
                <li key={a.id}>
                  <a href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-cpe-navy hover:text-cpe-royal">
                    <IconDownload /> {a.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 border-t border-slate-200 pt-8">
          <CompartirRedes titulo={n.titulo} />
        </div>
      </div>
    </article>
  );
}
