const SECCIONES = [
  { titulo: "Misión y visión", texto: "Textos de misión, visión y propósitos.", href: "/admin/institucional/mision" },
  { titulo: "Autoridades", texto: "Consejo directivo, vocales, síndicos y tribunal de ética.", href: "/admin/institucional/autoridades" },
  { titulo: "Historia", texto: "Línea de tiempo con los hitos institucionales.", href: "/admin/institucional/historia" },
  { titulo: "Comisiones", texto: "Las comisiones de trabajo y sus trámites relacionados.", href: "/admin/institucional/comisiones" },
  { titulo: "Reglamentos", texto: "Se gestionan junto con dictámenes y notas modelo.", href: "/admin/documentos" },
  { titulo: "Portada de Institucional", texto: "Las 6 cards de la página índice de Institucional.", href: "/admin/secciones/institucional" },
];

export default function AdminInstitucionalPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Institucional</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SECCIONES.map((s) => (
          <a key={s.href} href={s.href} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-lg font-bold text-cpe-navy">{s.titulo}</h3>
            <p className="mt-2 text-sm text-slate-500">{s.texto}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
