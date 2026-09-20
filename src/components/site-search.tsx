"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { buscarGlobal, type ResultadoBusqueda } from "@/app/buscar-actions";

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-[18px] w-[18px]">
      <circle cx="11" cy="11" r="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.6-3.6" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [activo, setActivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const requestId = useRef(0);

  const resetSearch = useCallback(() => {
    requestId.current++;
    setQuery("");
    setResultados([]);
    setCargando(false);
    setActivo(0);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    resetSearch();
  }, [resetSearch]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        resetSearch();
      } else if (e.key === "Escape") {
        closeSearch();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, resetSearch]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) return;
    const id = requestId.current;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await buscarGlobal(q);
        if (!cancelled && id === requestId.current) {
          setResultados(res);
          setActivo(0);
        }
      } catch {
        if (!cancelled && id === requestId.current) setResultados([]);
      } finally {
        if (!cancelled && id === requestId.current) setCargando(false);
      }
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  function onKeyDownInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((a) => Math.max(0, Math.min(a + 1, resultados.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      itemRefs.current[activo]?.click();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar en el sitio"
        className={
          compact
            ? "grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full text-white/70 transition hover:text-white"
            : "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
        }
      >
        <IconSearch />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex justify-center bg-cpe-navy/70 px-4 pt-20 backdrop-blur-sm sm:pt-28" onClick={closeSearch}>
          <div
            className="h-fit w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="text-slate-400"><IconSearch /></span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  requestId.current++;
                  setQuery(e.target.value);
                  setResultados([]);
                  setActivo(0);
                  setCargando(e.target.value.trim().length >= 2);
                }}
                onKeyDown={onKeyDownInput}
                placeholder="Buscar novedades, trámites, matriculados, prestaciones…"
                className="min-w-0 flex-1 text-[15px] text-cpe-navy outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Cerrar búsqueda"
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <IconClose />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 && (
                <p className="px-5 py-10 text-center text-sm text-slate-400">Escribí al menos 2 letras para empezar a buscar.</p>
              )}

              {query.trim().length >= 2 && cargando && (
                <p className="px-5 py-10 text-center text-sm text-slate-400">Buscando…</p>
              )}

              {query.trim().length >= 2 && !cargando && resultados.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-slate-400">No encontramos nada con “{query.trim()}”.</p>
              )}

              {resultados.length > 0 && (
                <ul className="py-2">
                  {resultados.map((r, i) => (
                    <li key={`${r.tipo}-${r.href}-${i}`}>
                      <Link
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        href={r.href}
                        onClick={closeSearch}
                        onMouseEnter={() => setActivo(i)}
                        className={`flex items-center justify-between gap-4 px-5 py-3 transition ${i === activo ? "bg-cpe-bg" : ""}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-cpe-navy">{r.titulo}</span>
                          {r.subtitulo && <span className="block truncate text-xs text-slate-500">{r.subtitulo}</span>}
                        </span>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {r.tipo}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="hidden items-center gap-4 border-t border-slate-100 px-5 py-2.5 text-[11px] text-slate-400 sm:flex">
              <span><kbd className="rounded border border-slate-200 px-1.5 py-0.5 font-sans">↑↓</kbd> navegar</span>
              <span><kbd className="rounded border border-slate-200 px-1.5 py-0.5 font-sans">↵</kbd> ir</span>
              <span><kbd className="rounded border border-slate-200 px-1.5 py-0.5 font-sans">esc</kbd> cerrar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
