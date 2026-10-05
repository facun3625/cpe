import { plainText } from "@/lib/rich-text";
import { prisma } from "@/lib/prisma";
import { PageHeader, TextInput } from "@/components/admin/fields";
import { NomencladorCarga } from "@/components/admin/nomenclador-carga";
import { readNomencladorConfig, AMBITOS } from "@/lib/nomenclador/config";
import { formatearMoneda } from "@/components/nomenclador/data";
import { Card, Field, SubmitButton, TextArea } from "@/components/admin/fields";
import { getNomencladorPopup } from "@/lib/nomenclador/popup";
import { guardarTextosNomenclador, guardarPopupNomenclador } from "@/app/admin/nomenclador/actions";

export default async function AdminNomencladorPage({ searchParams }: { searchParams: Promise<{ q?: string; popup?: string; titulo?: string }> }) {
  const { q, popup: popupGuardado, titulo: tituloGuardado } = await searchParams;
  const popup = await getNomencladorPopup();
  const [allItems, registro] = await Promise.all([
    prisma.nomencladorItem.findMany({ orderBy: { orden: "asc" } }),
    prisma.paginaTexto.findUnique({ where: { pagina: "nomenclador" } }),
  ]);
  const items = q ? allItems.filter((item) => plainText(item.nombre).toLocaleLowerCase("es").includes(q.toLocaleLowerCase("es"))) : allItems;
  const config = readNomencladorConfig(registro?.contenido);
  return <div>
    <PageHeader title="Nomenclador" />
    <NomencladorCarga config={config} />
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card title="Título de la tabla" hint="Se muestra arriba del cuadro de aranceles, en la web, el Excel y el PDF.">
        {tituloGuardado && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">Título guardado.</p>}
        <form action={guardarTextosNomenclador} className="space-y-4">
          <Field label="Título">
            <TextInput name="tituloTabla" defaultValue={config.tituloTabla} />
          </Field>
          <SubmitButton>Guardar título</SubmitButton>
        </form>
      </Card>
      <Card title="Popup al entrar al nomenclador" hint="Se muestra cada vez que alguien entra a la página.">
        {popupGuardado && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">Popup guardado.</p>}
        <form action={guardarPopupNomenclador} className="space-y-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="activo" defaultChecked={popup.activo} className="h-4 w-4" /> Mostrar popup
          </label>
          <Field label="Título del popup">
            <TextInput name="titulo" defaultValue={popup.titulo} />
          </Field>
          <Field label="Texto">
            <TextArea name="texto" rows={6} defaultValue={popup.texto} />
          </Field>
          <SubmitButton>Guardar popup</SubmitButton>
        </form>
      </Card>
    </div>
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
