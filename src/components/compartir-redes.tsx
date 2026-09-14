"use client";

import { useState } from "react";

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm5.78 14.07c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11a16 16 0 0 1-1.62-.6c-2.86-1.24-4.72-4.13-4.87-4.32-.14-.2-1.17-1.55-1.17-2.96s.73-2.1 1-2.39c.26-.29.57-.36.76-.36h.55c.18 0 .42-.03.65.5.24.55.82 1.9.89 2.04.07.14.11.31.02.5-.09.2-.13.31-.27.48-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.29.71 1.18 1.53 1.91 1.05.94 1.94 1.24 2.23 1.38.29.14.46.12.63-.07.18-.19.75-.87.95-1.17.2-.29.4-.24.67-.14.27.09 1.72.81 2.02.96.29.14.49.21.56.34.07.13.07.75-.17 1.42Z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.49-1.46H16.5V4.3c-.26-.03-1.15-.11-2.19-.11-2.17 0-3.65 1.32-3.65 3.75v2.09H8.15v3h2.51V21h2.84Z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M18.24 3H21l-6.35 7.26L22 21h-6.24l-4.89-6.4L4.9 21H2.13l6.79-7.76L2 3h6.4l4.42 5.85L18.24 3Zm-1.09 16.17h1.5L7.01 4.75H5.4l11.75 14.42Z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.5 14.5 9.5M11 7l1.3-1.3a3.5 3.5 0 0 1 5 5L16 12M13 17l-1.3 1.3a3.5 3.5 0 0 1-5-5L8 12" />
    </svg>
  );
}

export function CompartirRedes({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  function abrir(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  function compartir(red: "whatsapp" | "facebook" | "x") {
    const url = window.location.href;
    const texto = encodeURIComponent(titulo);
    const urlCod = encodeURIComponent(url);
    if (red === "whatsapp") abrir(`https://wa.me/?text=${texto}%20${urlCod}`);
    if (red === "facebook") abrir(`https://www.facebook.com/sharer/sharer.php?u=${urlCod}`);
    if (red === "x") abrir(`https://twitter.com/intent/tweet?url=${urlCod}&text=${texto}`);
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // noop: el navegador puede bloquear el acceso al portapapeles
    }
  }

  const botonClass = "grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-cpe-bg text-cpe-navy transition hover:bg-cpe-navy hover:text-white";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Compartir</span>
      <button type="button" onClick={() => compartir("whatsapp")} aria-label="Compartir por WhatsApp" className={botonClass}><IconWhatsapp /></button>
      <button type="button" onClick={() => compartir("facebook")} aria-label="Compartir en Facebook" className={botonClass}><IconFacebook /></button>
      <button type="button" onClick={() => compartir("x")} aria-label="Compartir en X" className={botonClass}><IconX /></button>
      <button type="button" onClick={copiarLink} aria-label="Copiar link" className={botonClass}><IconLink /></button>
      {copiado && <span className="text-xs font-semibold text-cpe-royal">¡Link copiado!</span>}
    </div>
  );
}
