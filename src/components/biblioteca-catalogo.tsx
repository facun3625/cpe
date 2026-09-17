"use client";

import { useState } from "react";
import { FotoPublica } from "@/components/foto-publica";

type Categoria = {
  id: string;
  nombre: string;
  posts: { id: string; titulo: string; bajada: string; portadaUrl: string | null; archivoUrl: string | null }[];
};

export function BibliotecaCatalogo({ categorias }: { categorias: Categoria[] }) {
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const seleccionada = categorias.find((categoria) => categoria.id === categoriaId);
  const visibles = seleccionada ? [seleccionada] : categorias;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-cpe-navy">Categorías</h2>
      <nav aria-label="Categorías de biblioteca" className="mt-4 flex flex-wrap gap-2">
        <button type="button" aria-pressed={!seleccionada} onClick={() => setCategoriaId(null)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${!seleccionada ? "border-cpe-navy bg-cpe-navy text-white" : "border-slate-200 bg-white text-cpe-navy hover:bg-slate-100"}`}>Todas</button>
        {categorias.map((categoria) => (
          <button key={categoria.id} type="button" aria-pressed={seleccionada?.id === categoria.id} onClick={() => setCategoriaId(categoria.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${seleccionada?.id === categoria.id ? "border-cpe-navy bg-cpe-navy text-white" : "border-slate-200 bg-white text-cpe-navy hover:bg-slate-100"}`}>
            {categoria.nombre} <span className="ml-1 opacity-60">({categoria.posts.length})</span>
          </button>
        ))}
      </nav>
      <div className="mt-8 space-y-10" aria-live="polite">
        {visibles.length === 0 && <p className="rounded-2xl bg-white p-6 text-slate-600">Estamos preparando nuevo material para la biblioteca.</p>}
        {visibles.map((categoria) => (
          <section key={categoria.id} aria-label={categoria.nombre}>
            <h3 className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">{categoria.nombre}</h3>
            {categoria.posts.length === 0 ? <p className="mt-4 text-sm text-slate-600">Próximamente habrá material en esta categoría.</p> : (
              <div className="mt-4 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {categoria.posts.map((post) => (
                  <article key={post.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-44 items-center justify-center bg-slate-100 p-3 sm:h-48">
                      <FotoPublica src={post.portadaUrl} alt={`Portada de ${post.titulo}`} className="h-full w-full object-contain" fallback={<div className="text-center text-slate-400"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10"><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1m0-15c3-2 6-2 9-1v15c-3-1-6-1-9 1V5Z" /></svg><p className="mt-2 text-xs">Portada no disponible</p></div>} />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h4 className="break-words text-base font-bold text-cpe-navy">{post.titulo}</h4>
                      <p className="mt-2 flex-1 break-words text-sm leading-5 text-slate-600">{post.bajada}</p>
                      {post.archivoUrl && <a href={post.archivoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-cpe-navy px-3 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal" aria-label={`Descargar bibliografía: ${post.titulo}`}><span aria-hidden="true">↓</span> Descargar</a>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
