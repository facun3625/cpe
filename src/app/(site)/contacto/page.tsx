import { InternalPage } from "@/components/internal-page";
import { SedeCard } from "@/components/sede-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  let sedes: Awaited<ReturnType<typeof prisma.sede.findMany>> = [];
  try {
    sedes = await prisma.sede.findMany({ orderBy: { orden: "asc" } });
  } catch {}

  return (
    <InternalPage
      eyebrow="Contacto"
      title="Estamos cerca, en distintos puntos de la provincia."
      intro="Elegí tu sede o delegación para conocer sus canales y horarios de atención."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sedes.map((sede) => (
          <SedeCard key={sede.id} sede={sede} variant="light" className="rounded-3xl border border-slate-200 bg-white p-7" />
        ))}
      </div>
    </InternalPage>
  );
}
