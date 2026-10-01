import { prisma } from "@/lib/prisma";

export type HeroTexto = { eyebrow: string; titulo: string; intro: string };
export type HeroDefinicion = { key: string; label: string; ruta: string; defaults: HeroTexto };

/** Encabezados (eyebrow/título/bajada) de cada página interna, editables desde /admin/encabezados. */
export const HEROES: HeroDefinicion[] = [
  { key: "novedades", label: "Novedades", ruta: "/novedades", defaults: { eyebrow: "Novedades", titulo: "Lo que pasa en nuestra comunidad.", intro: "Artículos de interés y novedades de la Sede Santa Fe y las delegaciones de Rafaela y Reconquista." } },
  { key: "matriculados", label: "Matriculados activos", ruta: "/matriculados", defaults: { eyebrow: "Matrícula profesional", titulo: "Matriculados activos.", intro: "Consultá el padrón de profesionales matriculados en el Colegio: enfermeros, licenciados y auxiliares de enfermería de toda la provincia." } },
  { key: "contacto", label: "Contacto", ruta: "/contacto", defaults: { eyebrow: "Contacto", titulo: "Estamos cerca, en distintos puntos de la provincia.", intro: "Elegí tu sede o delegación para conocer sus canales y horarios de atención." } },
  { key: "biblioteca", label: "Biblioteca", ruta: "/biblioteca", defaults: { eyebrow: "Biblioteca", titulo: "Conocimiento al alcance de toda la comunidad profesional.", intro: "Un espacio de consulta con bibliografía especializada y recursos académicos para estudiar, investigar y actualizarse." } },
  { key: "tramites", label: "Trámites", ruta: "/tramites", defaults: { eyebrow: "Trámites", titulo: "Resolver tus gestiones tiene que ser simple.", intro: "Requisitos para las principales gestiones vinculadas con tu matrícula profesional. Todos los trámites se inician a través del SAG (Sistema de Autogestión)." } },
  { key: "institucional", label: "Institucional (portada)", ruta: "/institucional", defaults: { eyebrow: "Institucional", titulo: "Una institución construida para acompañar.", intro: "El Colegio regula el ejercicio profesional, representa a la comunidad de enfermería y promueve su desarrollo en toda la provincia de Santa Fe." } },
  { key: "centro-educativo-recreativo", label: "Centro Educativo Recreativo", ruta: "/centro-educativo-recreativo", defaults: { eyebrow: "Centro Educativo Recreativo", titulo: "Un espacio pensado para formarnos y encontrarnos.", intro: "Conocé el Centro Educativo Recreativo (CER) del Colegio, un espacio para la capacitación y el encuentro de los matriculados." } },
  { key: "institucional-comisiones", label: "Institucional / Comisiones", ruta: "/institucional/comisiones", defaults: { eyebrow: "Institucional", titulo: "Comisiones.", intro: "Equipos de trabajo que abordan temas académicos, éticos, legales y profesionales del ejercicio de la enfermería." } },
  { key: "institucional-reglamentos", label: "Institucional / Reglamentos", ruta: "/institucional/reglamentos", defaults: { eyebrow: "Institucional", titulo: "Reglamentos.", intro: "Normativa institucional, código de ética, resoluciones y documentación de consulta." } },
  { key: "institucional-historia", label: "Institucional / Historia", ruta: "/institucional/historia", defaults: { eyebrow: "Institucional", titulo: "Nuestra historia.", intro: "Los hitos que dieron forma a la organización profesional de la enfermería santafesina." } },
  { key: "institucional-mision", label: "Institucional / Misión y visión", ruta: "/institucional/mision", defaults: { eyebrow: "Institucional", titulo: "Misión y visión.", intro: "Los principios que guían al Colegio en la representación, el acompañamiento y el desarrollo de la enfermería santafesina." } },
  { key: "institucional-autoridades", label: "Institucional / Autoridades", ruta: "/institucional/autoridades", defaults: { eyebrow: "Institucional", titulo: "Autoridades.", intro: "Quienes integran el Consejo Directivo y los órganos institucionales del Colegio." } },
  { key: "propuesta-educativa", label: "Actividad académica / Propuesta educativa", ruta: "/actividad-academica/propuesta-educativa", defaults: { eyebrow: "Actividad académica", titulo: "Propuesta educativa.", intro: "" } },
  { key: "actividad-academica", label: "Actividad académica (portada)", ruta: "/actividad-academica", defaults: { eyebrow: "Actividad académica", titulo: "Formación para una profesión que nunca deja de avanzar.", intro: "Cursos, jornadas, encuentros y recursos pensados para actualizar conocimientos y fortalecer la práctica cotidiana." } },
  { key: "becas", label: "Becas", ruta: "/becas", defaults: { eyebrow: "Becas", titulo: "Más oportunidades para seguir creciendo.", intro: "Apoyo económico para que los matriculados puedan participar en cursos, jornadas y eventos de formación profesional." } },
  { key: "dictamenes", label: "Dictámenes", ruta: "/dictamenes", defaults: { eyebrow: "Documentación", titulo: "Dictámenes.", intro: "Dictámenes de la Comisión de Incumbencias Profesionales de la Enfermería sobre alcances y límites del ejercicio." } },
  { key: "nomenclador", label: "Nomenclador", ruta: "/nomenclador", defaults: { eyebrow: "Aranceles", titulo: "Nomenclador de prestaciones.", intro: "Aranceles mínimos sugeridos para las prestaciones de enfermería. Consultá los precios publicados y descargá el nomenclador completo." } },
];

/** Prefijo para no chocar con otras PaginaTexto que ya usan la misma clave (ej. "becas" guarda los requisitos). */
function paginaKey(key: string) {
  return `hero-${key}`;
}

export async function getHero(key: string, defaults: HeroTexto): Promise<HeroTexto> {
  try {
    const registro = await prisma.paginaTexto.findUnique({ where: { pagina: paginaKey(key) } });
    const c = registro?.contenido as Partial<HeroTexto> | undefined;
    if (!c) return defaults;
    return {
      eyebrow: c.eyebrow || defaults.eyebrow,
      titulo: c.titulo || defaults.titulo,
      intro: c.intro ?? defaults.intro,
    };
  } catch {
    return defaults;
  }
}

export async function getHeroContenido(key: string) {
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: paginaKey(key) } });
  return registro?.contenido as Partial<HeroTexto> | undefined;
}

export { paginaKey as heroPaginaKey };
