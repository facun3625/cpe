"use server";

import { prisma } from "@/lib/prisma";

export type ResultadoBusqueda = {
  tipo: "Página" | "Novedad" | "Documento" | "Trámite" | "Comisión" | "Sede" | "Nomenclador" | "Matriculado";
  titulo: string;
  subtitulo?: string;
  href: string;
};

const TIPO_DOCUMENTO_LABELS: Record<string, string> = {
  DICTAMEN: "Dictamen",
  REGLAMENTO: "Reglamento",
  NOTA_MODELO: "Nota modelo",
  BECA: "Beca",
};

const PAGINAS_ESTATICAS: ResultadoBusqueda[] = [
  { tipo: "Página", titulo: "Institucional", href: "/institucional" },
  { tipo: "Página", titulo: "Misión y visión", href: "/institucional/mision" },
  { tipo: "Página", titulo: "Autoridades", href: "/institucional/autoridades" },
  { tipo: "Página", titulo: "Historia", href: "/institucional/historia" },
  { tipo: "Página", titulo: "Comisiones", href: "/institucional/comisiones" },
  { tipo: "Página", titulo: "Reglamentos", href: "/institucional/reglamentos" },
  { tipo: "Página", titulo: "Dictámenes", href: "/dictamenes" },
  { tipo: "Página", titulo: "Matriculados activos", href: "/matriculados" },
  { tipo: "Página", titulo: "Novedades", href: "/novedades" },
  { tipo: "Página", titulo: "Nomenclador de prestaciones", href: "/nomenclador" },
  { tipo: "Página", titulo: "Trámites", href: "/tramites" },
  { tipo: "Página", titulo: "Becas", href: "/becas" },
  { tipo: "Página", titulo: "Biblioteca", href: "/biblioteca" },
  { tipo: "Página", titulo: "Actividad académica", href: "/actividad-academica" },
  { tipo: "Página", titulo: "Propuesta educativa", href: "/actividad-academica/propuesta-educativa" },
  { tipo: "Página", titulo: "Contacto", href: "/contacto" },
];

/** Sin tildes/diacríticos y en minúsculas, para que "administracion" encuentre "Administración". */
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function coincide(q: string, ...campos: (string | null | undefined)[]) {
  const nq = normalizar(q);
  return campos.some((c) => c && normalizar(c).includes(nq));
}

export async function buscarGlobal(query: string): Promise<ResultadoBusqueda[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  let novedades: { titulo: string; slug: string; categoria: string; resumen: string }[] = [];
  let documentos: { titulo: string; archivoUrl: string | null; tipo: string }[] = [];
  let tramites: { titulo: string }[] = [];
  let comisiones: { titulo: string }[] = [];
  let sedes: { nombre: string; direccion: string }[] = [];
  let nomencladorItems: { nombre: string; tiempo: string }[] = [];
  let matriculados: { apellido: string; nombre: string; matricula: string }[] = [];

  try {
    [novedades, documentos, tramites, comisiones, sedes, nomencladorItems, matriculados] = await Promise.all([
      prisma.novedad.findMany({ where: { publicada: true }, select: { titulo: true, slug: true, categoria: true, resumen: true } }),
      prisma.documento.findMany({ where: { archivoUrl: { not: null } }, select: { titulo: true, archivoUrl: true, tipo: true } }),
      prisma.tramite.findMany({ select: { titulo: true } }),
      prisma.comision.findMany({ select: { titulo: true } }),
      prisma.sede.findMany({ select: { nombre: true, direccion: true } }),
      prisma.nomencladorItem.findMany({ select: { nombre: true, tiempo: true } }),
      prisma.matriculado.findMany({ select: { apellido: true, nombre: true, matricula: true } }),
    ]);
  } catch {
    // Si la base no responde, seguimos con lo que sí tenemos (páginas estáticas).
  }

  const paginas = PAGINAS_ESTATICAS.filter((p) => coincide(q, p.titulo)).slice(0, 4);

  const novedadesRes: ResultadoBusqueda[] = novedades
    .filter((n) => coincide(q, n.titulo, n.resumen))
    .slice(0, 4)
    .map((n) => ({ tipo: "Novedad", titulo: n.titulo, subtitulo: n.categoria, href: `/novedades/${n.slug}` }));

  const documentosRes: ResultadoBusqueda[] = documentos
    .filter((d) => coincide(q, d.titulo))
    .slice(0, 4)
    .map((d) => ({ tipo: "Documento", titulo: d.titulo, subtitulo: TIPO_DOCUMENTO_LABELS[d.tipo], href: d.archivoUrl! }));

  const tramitesRes: ResultadoBusqueda[] = tramites
    .filter((t) => coincide(q, t.titulo))
    .slice(0, 3)
    .map((t) => ({ tipo: "Trámite", titulo: t.titulo, href: "/tramites" }));

  const comisionesRes: ResultadoBusqueda[] = comisiones
    .filter((c) => coincide(q, c.titulo))
    .slice(0, 3)
    .map((c) => ({ tipo: "Comisión", titulo: c.titulo, href: "/institucional/comisiones" }));

  const sedesRes: ResultadoBusqueda[] = sedes
    .filter((s) => coincide(q, s.nombre))
    .slice(0, 3)
    .map((s) => ({ tipo: "Sede", titulo: s.nombre, subtitulo: s.direccion, href: "/contacto" }));

  const nomencladorRes: ResultadoBusqueda[] = nomencladorItems
    .filter((it) => coincide(q, it.nombre))
    .slice(0, 4)
    .map((it) => ({ tipo: "Nomenclador", titulo: it.nombre, subtitulo: it.tiempo, href: `/nomenclador?q=${encodeURIComponent(it.nombre)}` }));

  const matriculadosRes: ResultadoBusqueda[] = matriculados
    .filter((m) => coincide(q, m.apellido, m.nombre))
    .slice(0, 4)
    .map((m) => ({
      tipo: "Matriculado",
      titulo: `${m.apellido}, ${m.nombre}`,
      subtitulo: `Matrícula N.º ${m.matricula}`,
      href: `/matriculados?q=${encodeURIComponent(m.apellido)}`,
    }));

  return [...paginas, ...novedadesRes, ...documentosRes, ...tramitesRes, ...comisionesRes, ...sedesRes, ...nomencladorRes, ...matriculadosRes].slice(
    0,
    24
  );
}
