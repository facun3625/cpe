"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AMBITOS, type NomencladorConfig } from "@/lib/nomenclador/config";
import { formatearMoneda } from "@/components/nomenclador/data";
import { guardarPdfNomenclador, guardarValoresUpe, publicarPlanilla, revisarPlanilla, type EstadoNomenclador, type RevisionNomenclador } from "@/app/admin/nomenclador/actions";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800";
const buttonClass = "rounded-full bg-cpe-navy px-5 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50";
const fileClass = "block w-full min-w-0 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold";

function Mensaje({ result }: { result: EstadoNomenclador | null }) {
  return result && <p role={result.ok ? "status" : "alert"} className={`mt-4 rounded-xl p-3 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{result.mensaje}</p>;
}

export function NomencladorCarga({ config }: { config: NomencladorConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [revision, setRevision] = useState<RevisionNomenclador | null>(null);
  const [hoja, setHoja] = useState("");
  const [importResult, setImportResult] = useState<EstadoNomenclador | null>(null);
  const [upeResult, setUpeResult] = useState<EstadoNomenclador | null>(null);
  const [pdfResult, setPdfResult] = useState<EstadoNomenclador | null>(null);

  function run(task: () => Promise<void>, report: (result: EstadoNomenclador) => void) {
    startTransition(async () => {
      try { await task(); }
      catch { report({ ok: false, mensaje: "No se pudo completar la operación. Comprobá tu conexión y tu sesión." }); }
    });
  }

  return <div className="mt-6 space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-cpe-navy">Valores por U.P.E.</h2>
      <p className="mt-1 text-sm text-slate-500">Estos cuatro valores se muestran en las tarjetas de la página. Los importes de cada prestación se cargan desde la planilla.</p>
      <form onSubmit={(event) => {
        event.preventDefault(); const data = new FormData(event.currentTarget);
        run(async () => { const result = await guardarValoresUpe(data); setUpeResult(result); if (result.ok) router.refresh(); }, setUpeResult);
      }}>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {AMBITOS.map(({ key, label }) => <label key={`${key}-${config.valoresUpe[key]}`} className="text-xs font-semibold text-slate-600">{label}
            <input name={key} type="text" inputMode="decimal" required defaultValue={String(config.valoresUpe[key]).replace(".", ",")} disabled={pending} className={inputClass} />
          </label>)}
        </div>
        <button className={`${buttonClass} mt-4`} disabled={pending}>Guardar valores UPE</button>
        <Mensaje result={upeResult} />
      </form>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-cpe-navy">Cargar nomenclador desde Excel</h2>
      <p className="mt-1 text-sm text-slate-500">Subí una planilla .xlsx, .xls o .csv de hasta 10 MB con Actividad, Tiempo, Cant./UPE y precios CD, CN, DD y DN.</p>
      <p className="mt-2 text-sm text-slate-500">Primero revisás los datos. Al publicar, la planilla reemplaza todas las prestaciones y sus valores de referencia. Si incluye valores por UPE, también se actualizan las cuatro tarjetas.</p>
      <a href="/api/nomenclador/excel" className="mt-3 inline-flex text-sm font-semibold text-cpe-royal underline">Descargar el Excel actual para usar como modelo</a>
      {config.archivoNombre && <p className="mt-2 text-xs text-slate-500">Última planilla: {config.archivoNombre}</p>}
      <form className="mt-5 space-y-4" onSubmit={(event) => {
        event.preventDefault(); const data = new FormData(event.currentTarget);
        const intent = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value");
        setImportResult(null);
        if (intent === "publicar") {
          run(async () => { const result = await publicarPlanilla(data); setImportResult(result); if (result.ok) { setRevision(null); setUpeResult(null); setPdfResult(null); router.refresh(); } }, setImportResult);
        } else {
          run(async () => { const result = await revisarPlanilla(data); setRevision(result); setHoja(result.hoja ?? ""); }, setImportResult);
        }
      }}>
        <label className="block text-sm font-semibold text-slate-700">Planilla de prestaciones
          <input className={`${fileClass} mt-2`} type="file" name="archivo" accept=".xlsx,.xls,.csv" required disabled={pending} onChange={() => { setRevision(null); setHoja(""); setImportResult(null); }} />
        </label>
        {(revision?.hojas?.length ?? 0) > 1 ? <label className="block text-sm font-semibold text-slate-700">Hoja a publicar
          <select name="hoja" value={hoja} disabled={pending} onChange={(event) => { setHoja(event.target.value); setRevision((current) => current ? { ...current, ok: false, muestra: [], total: 0, errores: [], mensaje: "Revisá la hoja seleccionada antes de publicar." } : null); }} className={inputClass}>
            <option value="">Seleccionar versión…</option>{revision!.hojas!.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label> : <input type="hidden" name="hoja" value={hoja} />}
        <label className="block text-sm font-semibold text-slate-700">PDF de esta versión (opcional)
          <input className={`${fileClass} mt-2`} type="file" name="pdf" accept=".pdf,application/pdf" disabled={pending} />
        </label>
        <p className="text-xs text-slate-500">Al publicar una nueva planilla, se retira el PDF anterior para que las descargas correspondan a la misma versión. Podés adjuntar el PDF nuevo ahora o más abajo.</p>
        <button type="submit" name="intent" value="revisar" disabled={pending} className={buttonClass}>{pending ? "Procesando…" : "Revisar planilla"}</button>
        {revision && <div className="rounded-xl border border-slate-200 p-4">
          <Mensaje result={revision} />
          {!!revision.errores?.length && <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-red-700">{revision.errores.map((error, i) => <li key={i}>{error}</li>)}</ul>}
          {!!revision.muestra?.length && <>
            <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr>{["Prestación", "Tiempo", "UPE", "CD", "CN", "DD", "DN"].map((label) => <th key={label} className="whitespace-nowrap px-2 py-2">{label}</th>)}</tr></thead>
              <tbody>{revision.muestra.map((item) => <tr key={item.orden} className="border-t border-slate-100"><td className="min-w-48 px-2 py-2">{item.nombre}{item.noReconocida && " *"}</td><td className="px-2">{item.tiempo}</td><td className="px-2">{item.upe}</td>{AMBITOS.map(({ key }) => <td key={key} className="whitespace-nowrap px-2">{formatearMoneda(item[key])}</td>)}</tr>)}</tbody>
            </table></div>
            <p className="mt-3 text-xs text-slate-500">Vista previa de {revision.muestra.length} de {revision.total} prestaciones. Valores de referencia: {revision.referencias ?? 0}.</p>
          </>}
          {revision.valoresUpe && <p className="mt-3 text-xs text-slate-600">UPE detectados: {AMBITOS.map(({ key }) => `${key.toUpperCase()} ${formatearMoneda(revision.valoresUpe![key])}`).join(" · ")}</p>}
          {revision.ok && <button type="submit" name="intent" value="publicar" disabled={pending} className={`${buttonClass} mt-4`}>Publicar estas {revision.total} prestaciones</button>}
        </div>}
        <Mensaje result={importResult} />
      </form>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-cpe-navy">PDF descargable</h2>
      <p className="mt-1 text-sm text-slate-500">Adjuntá el PDF con los precios de la versión publicada. Hasta 10 MB.</p>
      {config.pdfUrl && <a href={config.pdfUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-cpe-royal underline">Ver PDF actual</a>}
      <form className="mt-4 space-y-4" onSubmit={(event) => {
        event.preventDefault(); const data = new FormData(event.currentTarget);
        run(async () => { const result = await guardarPdfNomenclador(data); setPdfResult(result); if (result.ok) router.refresh(); }, setPdfResult);
      }}>
        <input aria-label="PDF del nomenclador" type="file" name="pdf" accept=".pdf,application/pdf" required disabled={pending} className={fileClass} />
        <button className={buttonClass} disabled={pending}>{config.pdfUrl ? "Reemplazar PDF" : "Publicar PDF"}</button>
        <Mensaje result={pdfResult} />
      </form>
    </section>
  </div>;
}
