import Link from "next/link";
import { RichText } from "@/components/rich-text";

export type InfoItem = { title: string; text: string; href?: string; tag?: string; id?: string };

export function InternalPage({ eyebrow, title, intro, items, aside, children }: { eyebrow: string; title: string; intro: string; items?: InfoItem[]; aside?: string; children?: React.ReactNode }) {
  return <>
    <section className="relative overflow-hidden bg-cpe-navy py-10 text-white sm:py-14">
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border-[70px] border-white/[.04]" />
      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cpe-coral/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <nav className="mb-4 text-xs font-semibold text-white/50"><Link href="/" className="hover:text-white">Inicio</Link><span className="mx-2">/</span>{eyebrow}</nav>
        <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-mint">{eyebrow}</p>
        <h1 className="mt-2 max-w-4xl font-display text-3xl font-semibold leading-[1.05] tracking-[-.03em] sm:text-4xl lg:text-5xl"><RichText value={title} /></h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base"><RichText value={intro} /></p>
      </div>
    </section>
    <section className="bg-cpe-bg py-12 sm:py-16">
      <div className={`mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 ${aside ? "lg:grid-cols-[1fr_300px]" : ""}`}>
        <div>
          {children}
          {items && <div className="grid gap-4 sm:grid-cols-2">{items.map((item, index) => (
            <article key={item.id ?? index} id={item.id} className="group scroll-mt-32 rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="text-xs font-bold tracking-widest text-cpe-coral">{item.tag || String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-8 text-xl font-bold text-cpe-navy"><RichText value={item.title} /></h2>
              <p className="mt-3 text-sm leading-6 text-slate-600"><RichText value={item.text} /></p>
              {item.href && <Link href={item.href} className="mt-5 inline-flex text-sm font-bold text-cpe-navy hover:underline">Ver más ↗</Link>}
            </article>
          ))}</div>}
        </div>
        {aside && <aside className="h-fit rounded-3xl bg-cpe-coral p-7 text-white lg:sticky lg:top-36">
          <p className="text-xs font-bold uppercase tracking-widest text-white/65">Importante</p>
          <p className="mt-5 text-lg font-semibold leading-7"><RichText value={aside} /></p>
          <a href="https://cpesag.com.ar" target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-cpe-navy">Ingresar al SAG ↗</a>
        </aside>}
      </div>
    </section>
  </>;
}
