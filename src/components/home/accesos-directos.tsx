import Link from "next/link";

const ACCESOS = [
  { n: "01", title: "Matriculación", description: "Requisitos, documentación y pasos para ejercer en la provincia.", href: "/tramites" },
  { n: "02", title: "Padrón profesional", description: "Consultá el registro de matriculados activos del Colegio.", href: "/matriculados" },
  { n: "03", title: "Nomenclador", description: "Valores de referencia y prestaciones profesionales vigentes.", href: "/nomenclador" },
  { n: "04", title: "Formación", description: "Cursos, jornadas y propuestas para seguir creciendo.", href: "/actividad-academica" },
];

export function AccesosDirectos() {
  return <section className="bg-cpe-bg py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <div className="grid gap-8 lg:grid-cols-[.8fr_1.7fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-royal">Todo en un mismo lugar</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-cpe-navy sm:text-5xl">Gestiones simples, información clara.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Encontrá rápido lo que necesitás para ejercer, formarte y mantenerte al día.</p></div>
      <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2">{ACCESOS.map((item) => <Link key={item.title} href={item.href} className="group min-h-56 bg-white p-7 transition hover:bg-cpe-navy sm:p-8"><div className="flex items-start justify-between"><span className="text-xs font-bold tracking-widest text-cpe-royal">{item.n}</span><span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-cpe-navy transition group-hover:rotate-45 group-hover:border-white/30 group-hover:text-white">↗</span></div><h3 className="mt-10 text-xl font-bold text-cpe-navy group-hover:text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-500 group-hover:text-white/65">{item.description}</p></Link>)}</div>
    </div>
  </div></section>;
}
