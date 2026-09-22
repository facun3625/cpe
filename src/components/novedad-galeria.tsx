"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function Flecha({ direccion, label, onClick, className = "" }: { direccion: "prev" | "next"; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={label}
      className={`z-10 grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/90 text-cpe-navy shadow transition hover:bg-white ${className}`}
    >
      {direccion === "prev" ? "‹" : "›"}
    </button>
  );
}

export function NovedadGaleria({ imagenes }: { imagenes: string[] }) {
  const [lightboxIndice, setLightboxIndice] = useState<number | null>(null);
  const [puedeScrollIzq, setPuedeScrollIzq] = useState(false);
  const [puedeScrollDer, setPuedeScrollDer] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  function actualizarScrollState() {
    const el = stripRef.current;
    if (!el) return;
    setPuedeScrollIzq(el.scrollLeft > 4);
    setPuedeScrollDer(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    actualizarScrollState();
    window.addEventListener("resize", actualizarScrollState);
    return () => window.removeEventListener("resize", actualizarScrollState);
  }, [imagenes.length]);

  useEffect(() => {
    if (lightboxIndice === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndice(null);
      else if (e.key === "ArrowLeft") setLightboxIndice((i) => (i === null ? i : (i - 1 + imagenes.length) % imagenes.length));
      else if (e.key === "ArrowRight") setLightboxIndice((i) => (i === null ? i : (i + 1) % imagenes.length));
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndice, imagenes.length]);

  if (imagenes.length === 0) return null;

  function scrollPagina(dir: -1 | 1) {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="w-full">
      <div className="relative">
        {puedeScrollIzq && (
          <Flecha direccion="prev" label="Ver miniaturas anteriores" onClick={() => scrollPagina(-1)} className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 sm:-left-4" />
        )}
        <div
          ref={stripRef}
          onScroll={actualizarScrollState}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {imagenes.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setLightboxIndice(i)}
              aria-label={`Ver imagen ${i + 1} en tamaño completo`}
              className="relative aspect-square w-[calc((100%-3*0.75rem)/4)] shrink-0 overflow-hidden rounded-2xl bg-cpe-navy shadow-sm transition hover:opacity-90 sm:w-[calc((100%-4*0.75rem)/5)]"
            >
              <Image src={src} alt="" fill sizes="200px" className="object-cover" />
            </button>
          ))}
        </div>
        {puedeScrollDer && (
          <Flecha direccion="next" label="Ver más miniaturas" onClick={() => scrollPagina(1)} className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 sm:-right-4" />
        )}
      </div>

      {lightboxIndice !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/90"
          onClick={() => setLightboxIndice(null)}
        >
          <div className="flex h-full w-full items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-[85vh] w-full max-w-5xl">
              <Image src={imagenes[lightboxIndice]} alt="" fill sizes="90vw" className="object-contain" />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIndice(null); }}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <IconClose />
          </button>

          {imagenes.length > 1 && (
            <>
              <Flecha direccion="prev" label="Imagen anterior" onClick={() => setLightboxIndice((i) => (i === null ? i : (i - 1 + imagenes.length) % imagenes.length))} className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-6" />
              <Flecha direccion="next" label="Imagen siguiente" onClick={() => setLightboxIndice((i) => (i === null ? i : (i + 1) % imagenes.length))} className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-6" />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">
                {lightboxIndice + 1} / {imagenes.length}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
