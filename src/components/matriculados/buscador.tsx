"use client";

import { useMemo, useState } from "react";

type Nivel = "ENFERMERO" | "LICENCIADO" | "AUXILIAR";

type Matriculado = {
  id: string;
  apellido: string;
  nombre: string;
  dni: string;
  matricula: string;
  nivel: Nivel;
};

const NIVEL_LABELS: Record<Nivel, string> = {
  LICENCIADO: "Lic. en Enfermería",
  ENFERMERO: "Enfermero/a",
  AUXILIAR: "Aux. de Enfermería",
};

const NIVEL_STYLES: Record<Nivel, string> = {
  LICENCIADO: "bg-cpe-navy text-white",
  ENFERMERO: "bg-cpe-royal text-white",
  AUXILIAR: "bg-cpe-coral text-white",
};

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5 shrink-0 text-slate-400">
      <circle cx="11" cy="11" r="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.6-3.6" />
    </svg>
  );
}

const POR_PAGINA = 50;

export function BuscadorMatriculados({ matriculados, initialQuery }: { matriculados: Matriculado[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [pagina, setPagina] = useState(1);

  const resultados = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return matriculados;

    const tokens = q.replace(/,/g, " ").split(/\s+/).filter(Boolean);
    const soloDigitos = q.replace(/\D/g, "");

    return matriculados.filter((m) => {
      const nombreCompleto = normalizar(`${m.apellido} ${m.nombre}`);
      const coincideNombre = tokens.every((t) => nombreCompleto.includes(t));
      const coincideDni = soloDigitos.length > 0 && m.dni.replace(/\./g, "").includes(soloDigitos);
      const coincideMatricula = normalizar(m.matricula).includes(q);
      return coincideNombre || coincideDni || coincideMatricula;
    });
  }, [matriculados, query]);

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
          placeholder="Buscá por apellido, nombre, DNI o matrícula…"
          className="min-h-14 w-full rounded-full border border-slate-200 bg-white pl-14 pr-5 text-sm text-cpe-navy shadow-sm outline-none transition focus:border-cpe-royal focus:ring-4 focus:ring-cpe-royal/10"
        />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
      </p>

      <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {resultadosPagina.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            {matriculados.length === 0
              ? "Todavía no hay matriculados cargados en el padrón."
              : "No encontramos matriculados con ese criterio de búsqueda."}
          </p>
        ) : (
          resultadosPagina.map((m) => (
            <div key={m.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-cpe-navy">{m.apellido}, {m.nombre}</p>
                <p className="mt-0.5 text-xs text-slate-500">DNI {m.dni} · Matrícula N.º {m.matricula}</p>
              </div>
              <span className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-bold ${NIVEL_STYLES[m.nivel]}`}>
                {NIVEL_LABELS[m.nivel]}
              </span>
            </div>
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-cpe-navy transition hover:bg-cpe-bg disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white"
          >
            ‹ Anterior
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Página {paginaActual} de {totalPaginas}
          </p>
          <button
            type="button"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-cpe-navy transition hover:bg-cpe-bg disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white"
          >
            Siguiente ›
          </button>
        </div>
      )}
    </div>
  );
}
