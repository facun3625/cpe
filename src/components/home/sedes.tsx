import { prisma } from "@/lib/prisma";
import { SedeCard } from "@/components/sede-card";

export async function Sedes() {
  let sedes: Awaited<ReturnType<typeof prisma.sede.findMany>> = [];
  try {
    sedes = await prisma.sede.findMany({ orderBy: { orden: "asc" } });
  } catch {}

  if (sedes.length === 0) return null;

  const LG_COLS: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };
  const lgColsClass = LG_COLS[sedes.length] ?? "lg:grid-cols-5";
  const smColsClass = sedes.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";

  return (
    <section className="bg-cpe-navy">
      <div className="mx-auto max-w-7xl px-4 py-14 text-white sm:px-6 lg:px-8">
        <h2 className="border-l-4 border-cpe-gold pl-3 text-2xl font-bold">
          Sedes y delegaciones
        </h2>

        <div className={`mt-10 grid gap-px overflow-hidden rounded-3xl bg-white/15 ${smColsClass} ${lgColsClass}`}>
          {sedes.map((sede) => (
            <SedeCard key={sede.id} sede={sede} className="bg-cpe-navy-light p-7" />
          ))}
        </div>
      </div>
    </section>
  );
}
