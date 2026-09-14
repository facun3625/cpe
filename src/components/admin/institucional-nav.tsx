import Link from "next/link";

const SECCIONES = [
  { key: "mision", label: "Misión y visión", href: "/admin/institucional/mision" },
  { key: "autoridades", label: "Autoridades", href: "/admin/institucional/autoridades" },
  { key: "historia", label: "Historia", href: "/admin/institucional/historia" },
  { key: "comisiones", label: "Comisiones", href: "/admin/institucional/comisiones" },
] as const;

type SeccionKey = (typeof SECCIONES)[number]["key"];

export function InstitucionalNav({ active }: { active: SeccionKey }) {
  return (
    <div className="mb-6">
      <Link
        href="/admin/institucional"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-cpe-royal"
      >
        ← Institucional
      </Link>
      <div className="mt-3 flex flex-wrap gap-2">
        {SECCIONES.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              active === s.key
                ? "bg-cpe-navy text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:border-cpe-navy/30 hover:text-cpe-navy"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
