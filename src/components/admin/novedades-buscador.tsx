"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { AdminTable } from "@/components/admin/fields";

type NovedadRow = {
  id: string;
  titulo: string;
  categoria: string;
  fecha: string;
  publicada: boolean;
  destacadaHome: boolean;
};

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 shrink-0 text-slate-400">
      <circle cx="11" cy="11" r="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.6-3.6" />
    </svg>
  );
}

export function NovedadesBuscador({
  novedades,
  categorias,
  deleteAction,
  toggleDestacadaAction,
}: {
  novedades: NovedadRow[];
  categorias: string[];
  deleteAction: (id: string) => Promise<void>;
  toggleDestacadaAction: (id: string, destacadaHome: boolean) => Promise<void>;
}) {
  const [items, setItems] = useState(novedades);
  const [categoria, setCategoria] = useState<string>("TODAS");
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const conteosPorCategoria = useMemo(() => {
    const conteo: Record<string, number> = { TODAS: items.length };
    for (const c of categorias) conteo[c] = 0;
    for (const n of items) conteo[n.categoria] = (conteo[n.categoria] ?? 0) + 1;
    return conteo;
  }, [items, categorias]);

  const resultados = useMemo(() => {
    const q = normalizar(query.trim());
    return items.filter((n) => {
      if (categoria !== "TODAS" && n.categoria !== categoria) return false;
      if (!q) return true;
      return normalizar(n.titulo).includes(q);
    });
  }, [items, categoria, query]);

  const cantidadDestacadas = items.filter((n) => n.destacadaHome).length;

  function handleToggleDestacada(id: string, actual: boolean) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, destacadaHome: !actual } : n)));
    startTransition(() => {
      toggleDestacadaAction(id, !actual);
    });
  }

  function pillClass(active: boolean) {
    return `cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
      active ? "bg-cpe-navy text-white" : "border border-slate-200 bg-white text-slate-500 hover:border-cpe-navy/30 hover:text-cpe-navy"
    }`;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategoria("TODAS")} className={pillClass(categoria === "TODAS")}>
          Todas <span className="opacity-60">({conteosPorCategoria.TODAS})</span>
        </button>
        {categorias.map((c) => (
          <button key={c} type="button" onClick={() => setCategoria(c)} className={pillClass(categoria === c)}>
            {c} <span className="opacity-60">({conteosPorCategoria[c] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"><IconSearch /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cpe-royal focus:ring-4 focus:ring-cpe-royal/10"
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span className="text-cpe-gold">★</span> {cantidadDestacadas}/4 destacadas en portada
        </p>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {resultados.length} novedad{resultados.length === 1 ? "" : "es"}
      </p>

      <AdminTable head={["", "Título", "Categoría", "Fecha", "Estado"]} empty={resultados.length === 0 ? "No se encontraron novedades." : undefined}>
        {resultados.map((n) => (
          <tr key={n.id}>
            <td className="px-4 py-3">
              <button
                type="button"
                onClick={() => handleToggleDestacada(n.id, n.destacadaHome)}
                title={n.destacadaHome ? "Quitar de destacadas en portada" : "Destacar en portada"}
                aria-pressed={n.destacadaHome}
                className={`cursor-pointer text-lg transition hover:scale-110 ${n.destacadaHome ? "text-cpe-gold" : "text-slate-300 hover:text-cpe-gold/60"}`}
              >
                ★
              </button>
            </td>
            <td className="px-4 py-3 font-medium text-gray-900">{n.titulo}</td>
            <td className="px-4 py-3 text-gray-600">{n.categoria}</td>
            <td className="px-4 py-3 text-gray-600">{n.fecha}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${n.publicada ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {n.publicada ? "Publicada" : "Borrador"}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-3">
                <Link href={`/admin/novedades/${n.id}`} className="text-sm font-medium text-cpe-blue hover:underline">
                  Editar
                </Link>
                <form action={deleteAction.bind(null, n.id)}>
                  <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
