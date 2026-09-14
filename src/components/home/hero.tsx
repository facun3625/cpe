import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[660px] overflow-hidden bg-cpe-navy text-white lg:min-h-[720px]">
      <Image src="/images/hero-enfermeria.png" alt="Profesionales de enfermería de Santa Fe" fill priority sizes="100vw" className="object-cover object-[66%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,31,43,.98)_0%,rgba(4,31,43,.92)_36%,rgba(4,31,43,.35)_70%,rgba(4,31,43,.12)_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,#58b7ad_0,transparent_28%),radial-gradient(circle_at_42%_90%,#2f5f95_0,transparent_22%)]" />
      <div className="relative mx-auto flex min-h-[660px] max-w-7xl items-end px-5 pb-14 pt-24 sm:px-8 md:items-center md:pb-0 lg:min-h-[720px]"><div className="max-w-2xl">
        <h1 className="font-display text-5xl font-semibold leading-[.98] tracking-[-.04em] sm:text-6xl lg:text-7xl">Cuidamos a quienes <span className="text-cpe-royal">cuidan.</span></h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">Acompañamos, representamos y fortalecemos a las y los profesionales de enfermería en cada etapa de su ejercicio.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/matriculados" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-cpe-navy">Consultar matrícula</Link></div>
        <div className="mt-12 grid max-w-xl grid-cols-2 gap-4 border-t border-white/20 pt-6 sm:grid-cols-3"><div><strong className="block text-xl sm:text-2xl">3</strong><span className="text-[11px] text-white/60 sm:text-xs">Delegaciones</span></div><div><strong className="block text-xl sm:text-2xl">+40 años</strong><span className="text-[11px] text-white/60 sm:text-xs">de compromiso</span></div><div><strong className="block text-xl sm:text-2xl">Toda Santa Fe</strong><span className="text-[11px] text-white/60 sm:text-xs">en red</span></div></div>
      </div></div>
    </section>
  );
}
