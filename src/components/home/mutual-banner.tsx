export function MutualBanner() {
  return (
    <section className="bg-cpe-bg py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <a
          href="https://amemutual.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start justify-between gap-6 rounded-3xl bg-cpe-navy px-8 py-10 text-white transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:px-12"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-mint">Beneficio para matriculados</p>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Conocé los beneficios de AME Mutual.
            </h3>
          </div>
          <span className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-cpe-navy shadow-lg transition group-hover:bg-cpe-mint">
            Ir al sitio
            <span className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </span>
        </a>
      </div>
    </section>
  );
}
