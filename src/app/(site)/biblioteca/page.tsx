import Image from "next/image";
import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type CategoriaConPosts = Prisma.BibliotecaCategoriaGetPayload<{ include: { posts: true } }>;

export const dynamic = "force-dynamic";

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14" />
    </svg>
  );
}

export default async function Page() {
  let categorias: CategoriaConPosts[] = [];
  try {
    categorias = await prisma.bibliotecaCategoria.findMany({
      orderBy: { orden: "asc" },
      include: { posts: { where: { publicado: true }, orderBy: { orden: "asc" } } },
    });
  } catch {}

  const categoriasConPosts = categorias.filter((c) => c.posts.length > 0);

  return (
    <InternalPage
      eyebrow="Biblioteca"
      title="Conocimiento al alcance de toda la comunidad profesional."
      intro="Un espacio de consulta con bibliografía especializada y recursos académicos para estudiar, investigar y actualizarse."
    >
      {categoriasConPosts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-display text-2xl font-semibold text-cpe-navy">Próximamente, nuevo material.</p>
          <p className="mt-3 text-slate-600">Estamos preparando la bibliografía disponible para consulta.</p>
        </div>
      ) : (
        <div className="space-y-14">
          {categoriasConPosts.map((categoria) => (
            <div key={categoria.id}>
              <h2 className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">{categoria.nombre}</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {categoria.posts.map((post) => (
                  <article key={post.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                    {post.portadaUrl && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        <Image src={post.portadaUrl} alt="" fill sizes="(min-width: 640px) 400px, 100vw" className="object-cover" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold text-cpe-navy">{post.titulo}</h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{post.bajada}</p>
                      {post.archivoUrl && (
                        <a
                          href={post.archivoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-cpe-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-cpe-royal"
                        >
                          <IconDownload /> Descargar bibliografía
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </InternalPage>
  );
}
