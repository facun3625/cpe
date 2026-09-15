import Image from "next/image";
import Link from "next/link";

type Novedad = {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  imagenUrl: string | null;
  publicadoEn: Date;
};

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function NovedadCard({ novedad }: { novedad: Novedad }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-cpe-navy to-cpe-royal">
        {novedad.imagenUrl ? (
          <Image
            src={novedad.imagenUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/cpe-seal.png" alt="" width={80} height={80} className="opacity-90 transition duration-500 group-hover:scale-105" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-cpe-royal px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          {novedad.categoria}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-cpe-navy">
          {novedad.titulo}
        </h3>
        <p className="mt-2 text-xs text-gray-500">
          {formatFecha(novedad.publicadoEn)}
        </p>
        <div className="flex-1" />
        <Link
          href={`/novedades/${novedad.slug}`}
          className="mt-4 inline-flex w-fit items-center gap-1.5 self-start rounded-full bg-cpe-navy px-4 py-2 text-xs font-bold text-white transition hover:gap-2.5 hover:bg-cpe-royal"
        >
          Leer más <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
