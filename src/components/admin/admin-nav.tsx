"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVIGATION: [string, string][] = [
  ["Resumen", "/admin"],
  ["Novedades", "/admin/novedades"],
  ["Documentos", "/admin/documentos"],
  ["Matriculados", "/admin/matriculados"],
  ["Suscriptores", "/admin/suscriptores"],
  ["Institucional", "/admin/institucional"],
  ["Trámites", "/admin/tramites"],
  ["Becas", "/admin/becas"],
  ["Formación", "/admin/formacion"],
  ["Biblioteca", "/admin/biblioteca"],
  ["Sedes", "/admin/sedes"],
  ["Nomenclador", "/admin/nomenclador"],
  ["SEO", "/admin/seo"],
  ["Pop-up", "/admin/popup"],
  ["Usuarios", "/admin/usuarios"],
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8">
      {NAVIGATION.map(([label, href]) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`block rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
