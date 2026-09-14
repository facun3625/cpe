import { InternalPage } from "@/components/internal-page";
import { prisma } from "@/lib/prisma";

const AVATAR_COLORS = ["bg-cpe-navy", "bg-cpe-royal", "bg-cpe-coral", "bg-cpe-navy-light"];

function formatNombre(nombre: string) {
  const [apellido, nombres] = nombre.split(",").map((s) => s.trim());
  if (!nombres) return nombre;
  return `${nombres} ${apellido}`;
}

function getIniciales(nombre: string) {
  const [apellido, nombres] = nombre.split(",").map((s) => s.trim());
  if (!nombres) return nombre.charAt(0).toUpperCase();
  return `${nombres.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function Lista({ titulo, nombres }: { titulo: string; nombres: string[] }) {
  if (nombres.length === 0) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">{titulo}</p>
      <ul className="mt-5 space-y-3">
        {nombres.map((nombre) => (
          <li key={nombre} className="text-sm font-medium text-cpe-navy">{nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function Page() {
  let autoridades: Awaited<ReturnType<typeof prisma.autoridad.findMany>> = [];
  try {
    autoridades = await prisma.autoridad.findMany({ orderBy: [{ grupo: "asc" }, { orden: "asc" }] });
  } catch {}

  const consejoDirectivo = autoridades.filter((a) => a.grupo === "CONSEJO_DIRECTIVO");
  const vocalesTitulares = autoridades.filter((a) => a.grupo === "VOCAL_TITULAR").map((a) => a.nombre);
  const vocalesSuplentes = autoridades.filter((a) => a.grupo === "VOCAL_SUPLENTE").map((a) => a.nombre);
  const sindicos = autoridades.filter((a) => a.grupo === "SINDICO");
  const eticaTitulares = autoridades.filter((a) => a.grupo === "ETICA_TITULAR").map((a) => a.nombre);
  const eticaSuplentes = autoridades.filter((a) => a.grupo === "ETICA_SUPLENTE").map((a) => a.nombre);

  return (
    <InternalPage
      eyebrow="Institucional"
      title="Autoridades."
      intro="Quienes integran el Consejo Directivo y los órganos institucionales del Colegio."
    >
      <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-coral">Consejo directivo</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {consejoDirectivo.map((persona, index) => (
          <div key={persona.id} className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
              {getIniciales(persona.nombre)}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-cpe-coral">{persona.rol}</p>
            <p className="mt-1.5 text-base font-bold leading-5 text-cpe-navy">{formatNombre(persona.nombre)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Lista titulo="Vocales titulares" nombres={vocalesTitulares} />
        <Lista titulo="Vocales suplentes" nombres={vocalesSuplentes} />
      </div>

      {sindicos.length > 0 && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cpe-coral">Síndicos</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {sindicos.map((persona) => (
              <div key={persona.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{persona.rol}</p>
                <p className="mt-1 text-sm font-medium text-cpe-navy">{persona.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-xs font-bold uppercase tracking-[.22em] text-cpe-coral">Tribunal de ética y disciplina</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <Lista titulo="Miembros titulares" nombres={eticaTitulares} />
        <Lista titulo="Miembros suplentes" nombres={eticaSuplentes} />
      </div>
    </InternalPage>
  );
}
