import Link from "next/link";

export function BibliotecaNav({ active }: { active: "categorias" | "posts" }) {
  const tabs = [
    { key: "categorias", label: "Categorías", href: "/admin/biblioteca" },
    { key: "posts", label: "Posts", href: "/admin/biblioteca/posts" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
            active === t.key
              ? "bg-cpe-navy text-white"
              : "border border-slate-200 bg-white text-slate-500 hover:border-cpe-navy/30 hover:text-cpe-navy"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
