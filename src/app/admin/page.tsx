import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MODULOS = [
  { titulo: "Documentos", texto: "Dictámenes, reglamentos, notas modelo y documentos de becas.", href: "/admin/documentos" },
  { titulo: "Matriculados", texto: "Padrón de matriculados, con importación desde Excel.", href: "/admin/matriculados" },
  { titulo: "Suscriptores", texto: "Personas suscriptas al newsletter.", href: "/admin/suscriptores" },
  { titulo: "Institucional", texto: "Misión, autoridades, historia y comisiones.", href: "/admin/institucional" },
  { titulo: "Trámites", texto: "Requisitos y pasos de cada gestión.", href: "/admin/tramites" },
  { titulo: "Becas", texto: "Requisitos y documentos de becas.", href: "/admin/becas" },
  { titulo: "Formación", texto: "Propuesta educativa, biblioteca y actividad académica.", href: "/admin/formacion" },
  { titulo: "Sedes", texto: "Direcciones, horarios y contacto.", href: "/admin/sedes" },
  { titulo: "Nomenclador", texto: "Aranceles de las 122 prestaciones de enfermería.", href: "/admin/nomenclador" },
];

export default async function Page() {
  let novedades = 0;
  let matriculados = 0;
  let suscriptores = 0;
  let documentosPendientes = 0;
  try {
    [novedades, matriculados, suscriptores, documentosPendientes] = await Promise.all([
      prisma.novedad.count(),
      prisma.matriculado.count(),
      prisma.suscriptor.count(),
      prisma.documento.count({ where: { archivoUrl: null } }),
    ]);
  } catch {}

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cpe-coral">Panel general</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cpe-navy">Buen día. ¿Qué publicamos hoy?</h1>
          <p className="mt-3 text-sm text-slate-600">Gestioná el sitio desde un solo lugar.</p>
        </div>
        <Link href="/admin/novedades/nueva" className="rounded-full bg-cpe-coral px-5 py-3 text-center text-sm font-bold text-white">+ Nueva novedad</Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-cpe-navy p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-white/50">Novedades</p>
          <p className="mt-4 text-4xl font-bold">{novedades}</p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Matriculados</p>
          <p className="mt-4 text-4xl font-bold text-cpe-navy">{matriculados}</p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Suscriptos</p>
          <p className="mt-4 text-4xl font-bold text-cpe-navy">{suscriptores}</p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-slate-400">Documentos pendientes</p>
          <p className="mt-4 text-4xl font-bold text-cpe-coral">{documentosPendientes}</p>
        </div>
      </div>

      <h2 className="mt-12 text-lg font-bold text-cpe-navy">Contenido del sitio</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link href="/admin/novedades" className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Disponible</span>
          <h3 className="mt-5 text-xl font-bold">Novedades</h3>
          <p className="mt-2 text-sm text-slate-500">Crear, editar, publicar y despublicar noticias.</p>
        </Link>
        {MODULOS.map((m) => (
          <Link key={m.href} href={m.href} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Disponible</span>
            <h3 className="mt-5 text-xl font-bold">{m.titulo}</h3>
            <p className="mt-2 text-sm text-slate-500">{m.texto}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
