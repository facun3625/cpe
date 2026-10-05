import { prisma } from "@/lib/prisma";

export type HomeStat = { valor: string; etiqueta: string };
export type HomeHero = {
  tituloInicio: string;
  tituloDestacado: string;
  bajada: string;
  botonTexto: string;
  botonHref: string;
  stats: HomeStat[];
};

export const HOME_HERO_DEFAULTS: HomeHero = {
  tituloInicio: "Cuidamos a quienes",
  tituloDestacado: "cuidan.",
  bajada: "Acompañamos, representamos y fortalecemos a las y los profesionales de enfermería en cada etapa de su ejercicio.",
  botonTexto: "Consultar matrícula",
  botonHref: "/matriculados",
  stats: [
    { valor: "3", etiqueta: "Delegaciones" },
    { valor: "+40 años", etiqueta: "de compromiso" },
    { valor: "Toda Santa Fe", etiqueta: "en red" },
  ],
};

export const HOME_HERO_KEY = "home-hero";

export async function getHomeHero(): Promise<HomeHero> {
  try {
    const registro = await prisma.paginaTexto.findUnique({ where: { pagina: HOME_HERO_KEY } });
    const c = registro?.contenido as Partial<HomeHero> | undefined;
    if (!c) return HOME_HERO_DEFAULTS;
    return {
      tituloInicio: c.tituloInicio ?? HOME_HERO_DEFAULTS.tituloInicio,
      tituloDestacado: c.tituloDestacado ?? HOME_HERO_DEFAULTS.tituloDestacado,
      bajada: c.bajada ?? HOME_HERO_DEFAULTS.bajada,
      botonTexto: c.botonTexto ?? HOME_HERO_DEFAULTS.botonTexto,
      botonHref: c.botonHref || HOME_HERO_DEFAULTS.botonHref,
      stats: Array.isArray(c.stats) ? c.stats : HOME_HERO_DEFAULTS.stats,
    };
  } catch {
    return HOME_HERO_DEFAULTS;
  }
}
