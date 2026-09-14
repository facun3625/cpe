"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 4500;

export function NovedadGaleria({ imagenes }: { imagenes: string[] }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (imagenes.length <= 1 || pausado) return;
    timerRef.current = setInterval(() => {
      setIndice((i) => (i + 1) % imagenes.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imagenes.length, pausado]);

  if (imagenes.length === 0) return null;

  function ir(nuevoIndice: number) {
    setIndice((nuevoIndice + imagenes.length) % imagenes.length);
  }

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-cpe-navy shadow-lg">
        {imagenes.map((src, i) => (
          <div
            key={src + i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === indice ? 1 : 0, pointerEvents: i === indice ? "auto" : "none" }}
          >
            <Image src={src} alt="" fill sizes="(min-width: 768px) 700px, 100vw" className="object-cover" />
          </div>
        ))}

        {imagenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(indice - 1)}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/85 text-cpe-navy shadow transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => ir(indice + 1)}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/85 text-cpe-navy shadow transition hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {imagenes.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
              className={`h-2 cursor-pointer rounded-full transition-all ${i === indice ? "w-6 bg-cpe-navy" : "w-2 bg-cpe-navy/25 hover:bg-cpe-navy/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
