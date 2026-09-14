"use client";

import { useMemo, useState } from "react";
import { AdminTable, RowActions } from "@/components/admin/fields";

type Tipo = "DICTAMEN" | "REGLAMENTO" | "NOTA_MODELO" | "BECA";

type DocumentoRow = {
  id: string;
  titulo: string;
  tipo: Tipo;
  grupo: string | null;
  archivoUrl: string | null;
};

const TIPOS_ORDEN: Tipo[] = ["DICTAMEN", "REGLAMENTO", "NOTA_MODELO", "BECA"];

const TIPO_LABELS: Record<Tipo, string> = {
  DICTAMEN: "Dictamen",
  REGLAMENTO: "Reglamento",
  NOTA_MODELO: "Nota modelo",
  BECA: "Beca",
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

export function DocumentosBuscador({
  documentos,
  deleteAction,
}: {
  documentos: DocumentoRow[];
  deleteAction: (id: string) => Promise<void>;
}) {
  const [tipo, setTipo] = useState<Tipo | "TODOS">("TODOS");
  const [grupo, setGrupo] = useState<string>("TODOS");
  const [query, setQuery] = useState("");

  const conteosPorTipo = useMemo(() => {
    const conteo: Record<string, number> = { TODOS: documentos.length };
    for (const t of TIPOS_ORDEN) conteo[t] = 0;
    for (const d of documentos) conteo[d.tipo] = (conteo[d.tipo] ?? 0) + 1;
    return conteo;
  }, [documentos]);

  const gruposDisponibles = useMemo(() => {
    const set = new Set<string>();
    for (const d of documentos) {
      if (tipo !== "TODOS" && d.tipo !== tipo) continue;
      if (d.grupo) set.add(d.grupo);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [documentos, tipo]);

  const resultados = useMemo(() => {
    const q = normalizar(query.trim());
    return documentos.filter((d) => {
      if (tipo !== "TODOS" && d.tipo !== tipo) return false;
      if (grupo !== "TODOS" && d.grupo !== grupo) return false;
      if (!q) return true;
      return normalizar(d.titulo).includes(q) || (d.grupo ? normalizar(d.grupo).includes(q) : false);
    });
  }, [documentos, tipo, grupo, query]);

  function handleTipo(t: Tipo | "TODOS") {
    setTipo(t);
    setGrupo("TODOS");
  }

  function pillClass(active: boolean) {
    return `cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
      active ? "bg-cpe-navy text-white" : "border border-slate-200 bg-white text-slate-500 hover:border-cpe-navy/30 hover:text-cpe-navy"
    }`;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => handleTipo("TODOS")} className={pillClass(tipo === "TODOS")}>
          Todos <span className="opacity-60">({conteosPorTipo.TODOS})</span>
        </button>
        {TIPOS_ORDEN.map((t) => (
          <button key={t} type="button" onClick={() => handleTipo(t)} className={pillClass(tipo === t)}>
            {TIPO_LABELS[t]} <span className="opacity-60">({conteosPorTipo[t] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"><IconSearch /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o grupo…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cpe-royal focus:ring-4 focus:ring-cpe-royal/10"
          />
        </div>

        {gruposDisponibles.length > 0 && (
          <select
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-cpe-royal focus:ring-4 focus:ring-cpe-royal/10 sm:w-56"
          >
            <option value="TODOS">Todos los grupos</option>
            {gruposDisponibles.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {resultados.length} documento{resultados.length === 1 ? "" : "s"}
      </p>

      <AdminTable head={["Título", "Tipo", "Grupo", "Archivo"]} empty={resultados.length === 0 ? "No se encontraron documentos." : undefined}>
        {resultados.map((doc) => (
          <tr key={doc.id}>
            <td className="px-4 py-3 font-medium text-gray-900">{doc.titulo}</td>
            <td className="px-4 py-3 text-gray-600">{TIPO_LABELS[doc.tipo]}</td>
            <td className="px-4 py-3 text-gray-600">{doc.grupo ?? "—"}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${doc.archivoUrl ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {doc.archivoUrl ? "Cargado" : "Pendiente"}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <RowActions editHref={`/admin/documentos/${doc.id}`} deleteAction={deleteAction.bind(null, doc.id)} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
