"use client";

import { useEffect, useState } from "react";

export function NomencladorPopupModal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    if (!abierto) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-cpe-navy/70 p-4 backdrop-blur-sm" onClick={() => setAbierto(false)}>
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">✕</button>
        {titulo && <p className="pr-8 text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">{titulo}</p>}
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{children}</div>
        <button type="button" onClick={() => setAbierto(false)} className="mt-6 inline-flex cursor-pointer rounded-full bg-cpe-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal">Entendido</button>
      </div>
    </div>
  );
}
