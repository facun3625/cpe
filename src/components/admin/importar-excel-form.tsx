"use client";

import { useActionState, useRef, useState } from "react";
import type { ImportResultado } from "@/app/admin/matriculados/actions";
import { Card } from "@/components/admin/fields";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

const ESTADO_INICIAL: ImportResultado | null = null;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function IconExcel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h8L19 7.5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3.5V7a1 1 0 0 0 1 1h3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.2 13 5.6 6M14.8 13l-5.6 6" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V4m0 0 3.5 3.5M12 4 8.5 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14" />
    </svg>
  );
}

export function ImportarExcelForm({ action }: { action: (formData: FormData) => Promise<ImportResultado> }) {
  const [resultado, formAction, pending] = useActionState<ImportResultado | null, FormData>(
    async (_prev, formData) => action(formData),
    ESTADO_INICIAL
  );
  const [file, setFile] = useState<File | null>(null);
  const [modo, setModo] = useState<"agregar" | "reemplazar">("agregar");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmitClick() {
    if (modo === "reemplazar") setMostrarConfirmacion(true);
    else formRef.current?.requestSubmit();
  }

  function confirmarYEnviar() {
    setMostrarConfirmacion(false);
    formRef.current?.requestSubmit();
  }

  return (
    <Card
      title="Importar padrón desde Excel o CSV"
      hint="Columnas esperadas: Apellido, Nombre, DNI, Matrícula, Nivel. Acepta cualquier versión de Excel (.xls, .xlsx) y también CSV."
      action={
        <a
          href="/plantillas/matriculados-plantilla.xlsx"
          download
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-cpe-royal/40 hover:text-cpe-royal"
        >
          <IconDownload /> Descargar plantilla de prueba
        </a>
      }
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Al importar:</span>
        <div className="flex gap-2 rounded-full border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setModo("agregar")}
            className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${modo === "agregar" ? "bg-cpe-navy text-white" : "text-slate-500 hover:text-cpe-navy"}`}
          >
            Agregar y actualizar
          </button>
          <button
            type="button"
            onClick={() => setModo("reemplazar")}
            className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${modo === "reemplazar" ? "bg-red-600 text-white" : "text-slate-500 hover:text-red-600"}`}
          >
            Reemplazar todo el padrón
          </button>
        </div>
      </div>
      {modo === "reemplazar" && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
          ⚠ Se van a borrar todos los matriculados que no estén en el archivo que subas. No se puede deshacer.
        </p>
      )}

      <form ref={formRef} action={formAction} className="mt-4 flex flex-wrap items-center gap-3">
        <input type="hidden" name="modo" value={modo} />
        <input
          ref={inputRef}
          type="file"
          name="archivo"
          accept=".xlsx,.xls,.xlsb,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          required
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-cpe-royal/40 hover:text-cpe-royal"
        >
          <IconUpload /> Seleccionar archivo
        </button>

        {file ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2 text-sm">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600/10 text-emerald-700">
              <IconExcel />
            </span>
            <div className="min-w-0">
              <p className="max-w-[220px] truncate font-medium text-cpe-navy">{file.name}</p>
              <p className="text-[11px] text-slate-400">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Quitar archivo"
              className="ml-1 cursor-pointer text-slate-400 transition hover:text-red-500"
            >
              ×
            </button>
          </div>
        ) : (
          <span className="text-sm text-slate-400">Ningún archivo seleccionado</span>
        )}

        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={pending || !file}
          className="ml-auto cursor-pointer rounded-xl bg-cpe-coral px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cpe-coral-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Importando…" : "Importar"}
        </button>
      </form>

      <ConfirmDialog
        open={mostrarConfirmacion}
        title="Reemplazar todo el padrón"
        message="Se van a BORRAR todos los matriculados que no estén en este archivo. Esta acción no se puede deshacer."
        confirmLabel="Sí, reemplazar"
        onConfirm={confirmarYEnviar}
        onCancel={() => setMostrarConfirmacion(false)}
      />

      {resultado && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{resultado.creados} creados</span>
          <span className="rounded-full bg-cpe-royal/10 px-3 py-1 text-xs font-bold text-cpe-royal">{resultado.actualizados} actualizados</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{resultado.omitidos} omitidos</span>
          {resultado.eliminados > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{resultado.eliminados} eliminados</span>
          )}
          {resultado.errores.length > 0 && (
            <ul className="mt-2 w-full list-disc space-y-1 pl-5 text-xs text-red-600">
              {resultado.errores.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
