"use client";

import { plainText } from "@/lib/rich-text";

import { RichText } from "@/components/rich-text";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatearMoneda } from "./data";

const POR_PAGINA = 20;

type ItemNomenclador = {
  id: string;
  nombre: string;
  tiempo: string;
  cd: number;
  cn: number;
  dd?: number | null;
  dn: number;
  noReconocida: boolean;
};

function normalizar(texto: string) {
  return plainText(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5 shrink-0 text-slate-400">
      <circle cx="11" cy="11" r="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.6-3.6" />
    </svg>
  );
}

export function BuscadorNomenclador({ items, initialQuery }: { items: ItemNomenclador[]; initialQuery?: string }) {
  const separarDomicilio = items.some((item) => (item.dd ?? item.cn) !== item.cn);
  const columnas = separarDomicilio ? "sm:grid-cols-[1fr_65px_95px_95px_95px_95px]" : "sm:grid-cols-[1fr_70px_110px_140px_110px]";
  const [query, setQuery] = useState(initialQuery ?? "");
  const [pagina, setPagina] = useState(1);

  const resultados = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return items;
    return items.filter((a) => normalizar(a.nombre).includes(q));
  }, [items, query]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const resultadosPagina = resultados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  function handleQuery(value: string) {
    setQuery(value);
    setPagina(1);
  }

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"><IconSearch /></span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          placeholder="Buscá una prestación: curación, medicación, sonda, vía intravenosa…"
          className="min-h-14 w-full rounded-full border border-slate-200 bg-white pl-14 pr-5 text-sm text-cpe-navy shadow-sm outline-none transition focus:border-cpe-royal focus:ring-4 focus:ring-cpe-royal/10"
        />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {resultados.length} {resultados.length === 1 ? "prestación" : "prestaciones"}
      </p>

      <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className={`hidden ${columnas} gap-2 border-b border-slate-200 bg-cpe-bg px-6 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:grid`}>
          <span>Prestación</span>
          <span className="text-right">Tiempo</span>
          <span className="text-right">Consultorio D.</span>
          <span className="text-right">{separarDomicilio ? "Consultorio N." : "Cons. N. / Dom. D."}</span>
          {separarDomicilio && <span className="text-right">Domicilio D.</span>}
          <span className="text-right">Domicilio N.</span>
        </div>
        <div className="divide-y divide-slate-200">
          {resultadosPagina.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              No encontramos ninguna prestación con ese criterio de búsqueda.
            </p>
          ) : (
            resultadosPagina.map((a) => (
              <div key={a.id} className={`grid grid-cols-1 gap-2 px-6 py-4 ${columnas} sm:items-center`}>
                <div>
                  <p className="font-semibold text-cpe-navy"><RichText value={a.nombre} /></p>
                  {a.noReconocida && (
                    <Link href="/dictamenes" className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-cpe-coral hover:underline">
                      No corresponde a enfermería — ver dictamen ↗
                    </Link>
                  )}
                </div>
                <span className="text-xs text-slate-500 sm:text-right"><span className="sm:hidden">Tiempo: </span>{a.tiempo}</span>
                <span className="text-sm font-medium text-cpe-navy sm:text-right"><span className="sm:hidden">Consultorio diurno: </span>{formatearMoneda(a.cd)}</span>
                <span className="text-sm font-medium text-cpe-navy sm:text-right"><span className="sm:hidden">{separarDomicilio ? "Consultorio nocturno: " : "Consultorio nocturno / Domicilio diurno: "}</span>{formatearMoneda(a.cn)}</span>
                {separarDomicilio && <span className="text-sm font-medium text-cpe-navy sm:text-right"><span className="sm:hidden">Domicilio diurno: </span>{formatearMoneda(a.dd ?? a.cn)}</span>}
                <span className="text-sm font-medium text-cpe-navy sm:text-right"><span className="sm:hidden">Domicilio nocturno: </span>{formatearMoneda(a.dn)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-slate-200 text-cpe-navy transition hover:bg-cpe-bg disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Página anterior"
          >
            ‹
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPagina(n)}
              className={`h-9 w-9 cursor-pointer rounded-full text-sm font-bold transition ${n === paginaActual ? "bg-cpe-navy text-white" : "text-cpe-navy hover:bg-cpe-bg"}`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-slate-200 text-cpe-navy transition hover:bg-cpe-bg disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Valores en pesos argentinos, sin insumos. CD: consultorio diurno; CN: consultorio nocturno; DD: domicilio diurno; DN: domicilio nocturno.
      </p>
    </div>
  );
}
