import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NovedadCard } from "@/components/novedad-card";

export async function UltimasNovedades() {
  let novedades: Awaited<ReturnType<typeof prisma.novedad.findMany>> = [];
  try {
    novedades = await prisma.novedad.findMany({
      where: { publicada: true, destacadaHome: true }, orderBy: { publicadoEn: "desc" }, take: 4,
    });
    if (novedades.length === 0) {
      novedades = await prisma.novedad.findMany({
        where: { publicada: true }, orderBy: { publicadoEn: "desc" }, take: 4,
      });
    }
  } catch {}

  if (novedades.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="border-l-4 border-cpe-gold pl-3 text-2xl font-bold text-cpe-navy">
            Últimas novedades
          </h2>
          <Link
            href="/novedades"
            className="hidden text-sm font-medium text-cpe-royal hover:underline sm:inline-flex sm:items-center sm:gap-1"
          >
            Ver todas las novedades <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {novedades.map((novedad) => (
            <NovedadCard key={novedad.id} novedad={novedad} />
          ))}
        </div>
      </div>
    </section>
  );
}
