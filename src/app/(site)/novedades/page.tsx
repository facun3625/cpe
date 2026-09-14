import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { InternalPage } from "@/components/internal-page";
import { NovedadCard } from "@/components/novedad-card";

export const dynamic = "force-dynamic";

const CATEGORIAS = ["Sede Santa Fe", "Delegación Rafaela", "Delegación Reconquista"];

export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }){
  const { categoria } = await searchParams;
  let novedades: Awaited<ReturnType<typeof prisma.novedad.findMany>>=[];
  try { novedades=await prisma.novedad.findMany({where:{publicada:true, ...(categoria?{categoria}:{})},orderBy:{publicadoEn:"desc"}}); } catch {}
  return <InternalPage eyebrow="Novedades" title="Lo que pasa en nuestra comunidad." intro="Artículos de interés y novedades de la Sede Santa Fe y las delegaciones de Rafaela y Reconquista.">
    <div className="mb-8 flex flex-wrap gap-2">
      <Link href="/novedades" className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${!categoria ? "bg-cpe-navy text-white" : "bg-white text-cpe-navy border border-slate-200"}`}>Todas</Link>
      {CATEGORIAS.map((c) => <Link key={c} href={`/novedades?categoria=${encodeURIComponent(c)}`} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${categoria === c ? "bg-cpe-navy text-white" : "bg-white text-cpe-navy border border-slate-200"}`}>{c}</Link>)}
    </div>
    {novedades.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{novedades.map(n=><NovedadCard key={n.id} novedad={n} />)}</div> : <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center"><p className="font-display text-3xl font-semibold text-cpe-navy">Próximamente, nuevas historias.</p><p className="mt-3 text-slate-600">Estamos preparando las últimas novedades del Colegio.</p></div>}
  </InternalPage>
}
