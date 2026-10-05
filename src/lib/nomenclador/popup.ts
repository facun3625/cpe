import { prisma } from "@/lib/prisma";

export const NOMENCLADOR_POPUP_KEY = "nomenclador-popup";

export type NomencladorPopup = { activo: boolean; titulo: string; texto: string };

export async function getNomencladorPopup(): Promise<NomencladorPopup> {
  const vacio: NomencladorPopup = { activo: false, titulo: "", texto: "" };
  try {
    const registro = await prisma.paginaTexto.findUnique({ where: { pagina: NOMENCLADOR_POPUP_KEY } });
    const c = registro?.contenido as Partial<NomencladorPopup> | undefined;
    if (!c) return vacio;
    return { activo: c.activo === true, titulo: c.titulo ?? "", texto: c.texto ?? "" };
  } catch {
    return vacio;
  }
}
