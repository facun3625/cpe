"use client";

import { RichText } from "@/components/rich-text";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getVideoEmbedUrl } from "@/lib/video";

const STORAGE_KEY = "cpe-popup-visto";

type PopupTipo = "TEXTO" | "IMAGEN" | "VIDEO";

export function SitePopup({
  activo,
  tipo,
  titulo,
  texto,
  imagenUrl,
  videoUrl,
  mostrarSiempre,
}: {
  activo: boolean;
  tipo: PopupTipo;
  titulo: string | null;
  texto: string | null;
  imagenUrl: string | null;
  videoUrl: string | null;
  mostrarSiempre: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!activo) return;

    if (mostrarSiempre) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Si el navegador bloquea localStorage, mostramos igual (mejor eso que nunca mostrarlo).
    }

    const timer = setTimeout(() => {
      setOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [activo, mostrarSiempre]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const embedUrl = tipo === "VIDEO" && videoUrl ? getVideoEmbedUrl(videoUrl) : null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-cpe-navy/70 px-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {tipo === "IMAGEN" && imagenUrl && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3xl bg-slate-100">
              <Image src={imagenUrl} alt="" fill sizes="(min-width: 640px) 512px, 100vw" className="object-cover" />
            </div>
          )}
          {tipo === "VIDEO" && embedUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl bg-black">
              <iframe src={embedUrl} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="absolute right-3 top-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/90 text-cpe-navy shadow transition hover:bg-white"
          >
            ×
          </button>
        </div>

        <div className="p-7">
          {titulo && <h2 className="font-display text-2xl font-semibold text-cpe-navy"><RichText value={titulo} /></h2>}
          {texto && (
            <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
              <RichText value={texto} />
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-6 cursor-pointer rounded-full bg-cpe-navy px-6 py-2.5 text-sm font-bold text-white transition hover:bg-cpe-royal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
