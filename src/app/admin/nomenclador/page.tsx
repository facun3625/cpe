import { plainText } from "@/lib/rich-text";
import { prisma } from "@/lib/prisma";
import { PageHeader, TextInput } from "@/components/admin/fields";
import { NomencladorCarga } from "@/components/admin/nomenclador-carga";
import { readNomencladorConfig, AMBITOS } from "@/lib/nomenclador/config";
import { formatearMoneda } from "@/components/nomenclador/data";

export default async function AdminNomencladorPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const [allItems, registro] = await Promise.all([
    prisma.nomencladorItem.findMany({ orderBy: { orden: "asc" } }),
    prisma.paginaTexto.findUnique({ where: { pagina: "nomenclador" } }),
  ]);
  const items = q ? allItems.filter((item) => plainText(item.nombre).toLocaleLowerCase("es").includes(q.toLocaleLowerCase("es"))) : allItems;
  const config = readNomencladorConfig(registro?.contenido);
  return <div>
    <PageHeader title="Nomenclador" />
    <NomencladorCarga config={config} />
    <h2 className="mt-8 text-lg font-bold text-cpe-navy">Prestaciones publicadas</h2>
    <p className="mt-2 text-sm text-slate-500">{items.length} prestaciones {q ? `que coinciden con "${q}"` : "en total"}. Para actualizar los precios, cargá una nueva planilla.</p>
    <form className="mt-4 flex gap-2"><TextInput name="q" defaultValue={q ?? ""} placeholder="Buscar por nombre…" /><button className="rounded-xl bg-slate-100 px-4 text-sm font-semibold">Buscar</button></form>
    <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs text-slate-500"><tr>{["Prestación", "Tiempo", "UPE", "CD", "CN", "DD", "DN"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
      <tbody>{items.map((item) => <tr key={item.id} className="border-t border-slate-100">
        <td className="min-w-56 px-4 py-3 font-medium text-slate-800">{plainText(item.nombre)}{item.noReconocida && " *"}</td><td className="px-4">{item.tiempo}</td><td className="px-4">{item.upe}</td>
        {AMBITOS.map(({ key }) => <td key={key} className="whitespace-nowrap px-4">{formatearMoneda(item[key] ?? item.cn)}</td>)}
      </tr>)}{!items.length && <tr><td colSpan={7} className="p-6 text-center text-slate-500">No hay prestaciones para mostrar.</td></tr>}</tbody>
    </table></div>
  </div>;
}
