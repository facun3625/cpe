"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SocialLinks } from "@/components/social-links";
import { SiteSearch } from "@/components/site-search";

type NavChild = { href: string; label: string };
type NavLink = { href: string; label: string; children?: NavChild[]; align?: "left" | "right" };

const NAV_LINKS: NavLink[] = [
  {
    href: "/institucional",
    label: "Institucional",
    children: [
      { href: "/institucional/mision", label: "Misión" },
      { href: "/institucional/autoridades", label: "Autoridades" },
      { href: "/institucional/historia", label: "Historia" },
      { href: "/institucional/comisiones", label: "Comisiones" },
      { href: "/institucional/reglamentos", label: "Reglamentos" },
    ],
  },
  { href: "/dictamenes", label: "Dictámenes" },
  { href: "/matriculados", label: "Matriculados Activos" },
  { href: "/novedades", label: "Novedades" },
  { href: "/nomenclador", label: "Nomenclador" },
  { href: "/tramites", label: "Trámites" },
  { href: "/becas", label: "Becas" },
  {
    href: "/actividad-academica",
    label: "Act. Académica",
    align: "right",
    children: [
      { href: "/biblioteca", label: "Biblioteca" },
      { href: "/actividad-academica/propuesta-educativa", label: "Propuesta Educativa" },
    ],
  },
];

export function SiteHeader({ novedadCategorias = [] }: { novedadCategorias?: string[] }) {
  const [open, setOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks: NavLink[] = NAV_LINKS.map((link) =>
    link.href === "/novedades"
      ? {
          ...link,
          children: [
            { href: "/novedades", label: "Todas" },
            ...novedadCategorias.map((c) => ({ href: `/novedades?categoria=${encodeURIComponent(c)}`, label: c })),
          ],
        }
      : link,
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setDesktopOpen(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-cpe-royal/95 text-white backdrop-blur-xl">
      <div className="bg-cpe-navy text-white"><div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5 text-[11px] font-semibold tracking-wide sm:px-8"><Link href="/login" className="hidden text-white/65 transition hover:text-white sm:block">Acceso administradores</Link><div className="ml-auto flex items-center gap-3 sm:gap-5"><a href="mailto:colegioenfermeros@gmail.com" className="hidden text-white/70 transition hover:text-white md:block">colegioenfermeros@gmail.com</a><Link href="/contacto" className="hidden text-white/70 transition hover:text-white sm:block">Contacto</Link><a href="https://cpesag.com.ar" target="_blank" rel="noreferrer" className="whitespace-nowrap text-white transition hover:text-white/80">Ingresar al SAG ↗</a><SocialLinks className="border-l border-white/15 pl-3 text-white sm:pl-5" /></div></div></div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:h-24 sm:px-8 xl:h-[104px]">
        <Link href="/" onClick={() => setOpen(false)} className="relative z-10 shrink-0"><Image src="/logo_final.png" alt="CPE Santa Fe" width={885} height={256} priority className="h-12 w-auto object-contain object-left sm:h-16 xl:h-[76px]" /></Link>
        <nav ref={navRef} className="hidden items-center gap-1 xl:flex" aria-label="Navegación principal">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const isOpen = desktopOpen === link.href;
            if (!link.children) {
              return (
                <Link key={link.href} href={link.href} className={`cursor-pointer whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold transition ${active ? "text-white" : "text-white/75 hover:text-white"}`}>
                  {link.label}
                </Link>
              );
            }
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setDesktopOpen(link.href);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setDesktopOpen(null), 150);
                }}
              >
                <button
                  type="button"
                  onClick={() => setDesktopOpen(isOpen ? null : link.href)}
                  className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold outline-none transition ${active ? "text-white" : "text-white/75 hover:text-white"}`}
                  aria-expanded={isOpen}
                >
                  {link.label}
                  <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>▾</span>
                </button>
                <div
                  className={`absolute top-full z-20 min-w-[190px] origin-top rounded-2xl bg-white px-1 py-3 shadow-2xl transition-all duration-[400ms] ease-in-out ${link.align === "right" ? "right-0" : "left-0"} ${isOpen ? "translate-y-2 scale-100 opacity-100" : "pointer-events-none translate-y-0 scale-95 opacity-0"}`}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setDesktopOpen(null)}
                      className="block cursor-pointer rounded-xl px-3.5 py-0.5 text-[13px] font-normal text-slate-600 transition hover:text-cpe-royal"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <SiteSearch />
          <button
            type="button"
            onClick={() => setOpen((prev) => { if (prev) setMobileOpen(null); return !prev; })}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors xl:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span className="relative flex h-4 w-5 flex-col justify-between">
              <span className={`h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-in-out ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-0.5 w-full rounded-full bg-white transition-all duration-200 ease-in-out ${open ? "scale-x-0 opacity-0" : "opacity-100"}`} />
              <span className={`h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-in-out ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <nav
        className={`absolute inset-x-0 top-full max-h-[calc(100vh-80px)] overflow-y-auto border-t border-white/10 bg-cpe-navy px-5 pb-6 pt-3 shadow-2xl transition-all duration-300 ease-out sm:max-h-[calc(100vh-96px)] xl:hidden ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
        aria-label="Navegación móvil"
        aria-hidden={!open}
      >
        {navLinks.map((link) => {
          if (!link.children) {
            return (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="flex cursor-pointer items-center justify-between border-b border-white/10 py-3.5 font-semibold text-white active:bg-white/10">
                {link.label}<span aria-hidden>↗</span>
              </Link>
            );
          }
          const isOpen = mobileOpen === link.href;
          return (
            <div key={link.href} className="border-b border-white/10">
              <button type="button" onClick={() => setMobileOpen(isOpen ? null : link.href)} tabIndex={open ? 0 : -1} className="flex w-full cursor-pointer items-center justify-between py-3.5 font-semibold text-white active:bg-white/10" aria-expanded={isOpen}>
                {link.label}
                <span className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden>▾</span>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="pb-3 pl-4">
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => { setOpen(false); setMobileOpen(null); }} tabIndex={open && isOpen ? 0 : -1} className="block cursor-pointer py-2.5 text-sm font-medium text-white/80 active:bg-white/10">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </header>
  );
}
