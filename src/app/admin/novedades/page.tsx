import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NovedadesBuscador } from "@/components/admin/novedades-buscador";
import { Card, Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";
import { deleteNovedad, guardarTextosNovedades, toggleDestacadaHome } from "./actions";

type TextosNovedades = { eyebrow?: string; titulo?: string; intro?: string };

export default async function AdminNovedadesPage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const { guardado } = await searchParams;
  const [novedades, categorias, registro] = await Promise.all([
    prisma.novedad.findMany({ orderBy: { publicadoEn: "desc" } }),
    prisma.novedadCategoria.findMany({ orderBy: { orden: "asc" } }),
    prisma.paginaTexto.findUnique({ where: { pagina: "novedades" } }),
  ]);
  const textos = (registro?.contenido as TextosNovedades | undefined) ?? {};

  const filas = novedades.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    categoria: n.categoria,
    fecha: new Intl.DateTimeFormat("es-AR").format(n.publicadoEn),
    publicada: n.publicada,
    destacadaHome: n.destacadaHome,
  }));

  const nombresCategorias = categorias.map((c) => c.nombre);
  for (const n of novedades) {
    if (!nombresCategorias.includes(n.categoria)) nombresCategorias.push(n.categoria);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Novedades</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/novedades/categorias"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Categorías
          </Link>
          <Link
            href="/admin/novedades/nueva"
            className="rounded-md bg-cpe-navy px-4 py-2 text-sm font-semibold text-white hover:bg-cpe-navy-light"
          >
            + Nueva novedad
          </Link>
        </div>
      </div>

      {guardado && (
        <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Cambios guardados.
        </p>
      )}

      <div className="mt-6">
        <Card title="Textos de la página" hint="Encabezado que se muestra arriba de /novedades.">
          <form action={guardarTextosNovedades} className="space-y-4">
            <Field label="Eyebrow (etiqueta pequeña)">
              <TextInput name="eyebrow" defaultValue={textos.eyebrow ?? "Novedades"} />
            </Field>
            <Field label="Título">
              <TextInput name="titulo" defaultValue={textos.titulo ?? "Lo que pasa en nuestra comunidad."} />
            </Field>
            <Field label="Bajada">
              <TextArea rich={false} name="intro" rows={2} defaultValue={textos.intro ?? "Artículos de interés y novedades de la Sede Santa Fe y las delegaciones de Rafaela y Reconquista."} />
            </Field>
            <SubmitButton>Guardar cambios</SubmitButton>
          </form>
        </Card>
      </div>

      <div className="mt-6">
        <NovedadesBuscador
          novedades={filas}
          categorias={nombresCategorias}
          deleteAction={deleteNovedad}
          toggleDestacadaAction={toggleDestacadaHome}
        />
      </div>
    </div>
  );
}
