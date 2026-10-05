"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { HOME_HERO_KEY, type HomeStat } from "@/lib/home-hero";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

export async function guardarInicio(formData: FormData) {
  await requireSession();

  const stats: HomeStat[] = [1, 2, 3].map((i) => ({
    valor: String(formData.get(`statValor${i}`) ?? "").trim(),
    etiqueta: String(formData.get(`statEtiqueta${i}`) ?? "").trim(),
  })).filter((s) => s.valor || s.etiqueta);

  const contenido = {
    tituloInicio: String(formData.get("tituloInicio") ?? "").trim(),
    tituloDestacado: String(formData.get("tituloDestacado") ?? "").trim(),
    bajada: String(formData.get("bajada") ?? "").trim(),
    botonTexto: String(formData.get("botonTexto") ?? "").trim(),
    botonHref: String(formData.get("botonHref") ?? "").trim(),
    stats,
  };

  await prisma.paginaTexto.upsert({
    where: { pagina: HOME_HERO_KEY },
    update: { contenido },
    create: { pagina: HOME_HERO_KEY, contenido },
  });

  revalidatePath("/", "page");
  revalidatePath("/admin/inicio");
  redirect("/admin/inicio?guardado=1");
}
