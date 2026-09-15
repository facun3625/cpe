"use client";

import { useRef, useState } from "react";

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 16 4.5-4.5a2 2 0 0 1 2.8 0L15 15.5M14 14l1.7-1.7a2 2 0 0 1 2.8 0L20 14" />
      <circle cx="8.5" cy="9" r="1.25" />
    </svg>
  );
}

/** Input de imagen única con preview de la existente o de la que se elige.
 * Si se quita la imagen (sin elegir una nueva), manda un input oculto
 * `${name}Eliminar=1` para que la acción del servidor sepa que hay que
 * limpiar la URL guardada en vez de dejarla como estaba. */
export function ImagenPortadaInput({ name, defaultUrl }: { name: string; defaultUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(defaultUrl ?? null);
  const [eliminar, setEliminar] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setEliminar(false);
  }

  function quitar() {
    setPreview(null);
    setEliminar(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input ref={inputRef} type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
      {eliminar && <input type="hidden" name={`${name}Eliminar`} value="1" />}
      <div className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-cpe-royal/40">
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-cpe-navy/0 opacity-0 transition group-hover:bg-cpe-navy/55 group-hover:opacity-100"
            >
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-cpe-navy shadow">Cambiar imagen</span>
            </button>
            <button
              type="button"
              onClick={quitar}
              aria-label="Quitar imagen"
              title="Quitar imagen"
              className="absolute right-3 top-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/90 text-slate-500 shadow transition hover:bg-white hover:text-red-600"
            >
              ×
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-slate-400"
          >
            <IconImage />
            <span className="text-xs font-semibold">Subir imagen de portada</span>
          </button>
        )}
      </div>
    </div>
  );
}

type GaleriaItem =
  | { id: string; kind: "existing"; url: string }
  | { id: string; kind: "new"; file: File; previewUrl: string };

/** Galería reordenable (drag & drop + flechas) con preview de existentes y nuevas. */
export function GaleriaManager({
  nuevasFieldName,
  ordenFieldName,
  existentes,
}: {
  nuevasFieldName: string;
  ordenFieldName: string;
  existentes: string[];
}) {
  const [items, setItems] = useState<GaleriaItem[]>(() => existentes.map((url) => ({ id: url, kind: "existing", url })));
  const pickerRef = useRef<HTMLInputElement>(null);
  const submissionRef = useRef<HTMLInputElement>(null);
  const dragId = useRef<string | null>(null);

  function syncSubmissionInput(next: GaleriaItem[]) {
    const dt = new DataTransfer();
    for (const item of next) if (item.kind === "new") dt.items.add(item.file);
    if (submissionRef.current) submissionRef.current.files = dt.files;
  }

  function update(next: GaleriaItem[]) {
    setItems(next);
    syncSubmissionInput(next);
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const nuevos: GaleriaItem[] = Array.from(fileList).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      kind: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    update([...items, ...nuevos]);
    if (pickerRef.current) pickerRef.current.value = "";
  }

  function removeItem(id: string) {
    update(items.filter((i) => i.id !== id));
  }

  function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= items.length) return;
    const copy = [...items];
    [copy[idx], copy[swapIdx]] = [copy[swapIdx], copy[idx]];
    update(copy);
  }

  function onDrop(targetId: string) {
    const sourceId = dragId.current;
    dragId.current = null;
    if (!sourceId || sourceId === targetId) return;
    const from = items.findIndex((i) => i.id === sourceId);
    const to = items.findIndex((i) => i.id === targetId);
    if (from < 0 || to < 0) return;
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    update(copy);
  }

  const ordenJson = JSON.stringify(items.map((i) => (i.kind === "existing" ? { t: "e", u: i.url } : { t: "n" })));

  return (
    <div>
      <input ref={pickerRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      <input ref={submissionRef} type="file" name={nuevasFieldName} multiple className="hidden" />
      <input type="hidden" name={ordenFieldName} value={ordenJson} />

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => (dragId.current = item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(item.id)}
              className="group relative aspect-square cursor-grab overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.kind === "existing" ? item.url : item.previewUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 flex items-start justify-between bg-gradient-to-b from-black/45 via-transparent to-black/10 p-1.5 opacity-0 transition group-hover:opacity-100">
                <span className="rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-white">{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Quitar imagen"
                  className="pointer-events-auto grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-white text-red-600 shadow"
                >
                  ×
                </button>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-1.5 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(item.id, -1)}
                  disabled={idx === 0}
                  aria-label="Mover antes"
                  className="pointer-events-auto grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-white/90 text-[11px] font-bold text-cpe-navy shadow disabled:cursor-default disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(item.id, 1)}
                  disabled={idx === items.length - 1}
                  aria-label="Mover después"
                  className="pointer-events-auto grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-white/90 text-[11px] font-bold text-cpe-navy shadow disabled:cursor-default disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => pickerRef.current?.click()}
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-cpe-royal/40 hover:text-cpe-royal"
      >
        + Agregar imágenes
      </button>
    </div>
  );
}

type Existing = { id: string; nombre: string; url: string };

function extBadge(nombre: string) {
  return (nombre.split(".").pop() ?? "").slice(0, 4).toUpperCase();
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Lista elegante de adjuntos existentes (con opción de quitar/deshacer) + nuevos archivos a subir. */
export function ArchivosManager({
  nuevosFieldName,
  eliminarFieldName,
  existentes,
}: {
  nuevosFieldName: string;
  eliminarFieldName: string;
  existentes: Existing[];
}) {
  const [removidos, setRemovidos] = useState<Set<string>>(new Set());
  const [nuevos, setNuevos] = useState<File[]>([]);
  const pickerRef = useRef<HTMLInputElement>(null);
  const submissionRef = useRef<HTMLInputElement>(null);

  function syncSubmissionInput(files: File[]) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    if (submissionRef.current) submissionRef.current.files = dt.files;
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const next = [...nuevos, ...Array.from(fileList)];
    setNuevos(next);
    syncSubmissionInput(next);
    if (pickerRef.current) pickerRef.current.value = "";
  }

  function removeNuevo(idx: number) {
    const next = nuevos.filter((_, i) => i !== idx);
    setNuevos(next);
    syncSubmissionInput(next);
  }

  function toggleRemovido(id: string) {
    setRemovidos((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  const hayContenido = existentes.length > 0 || nuevos.length > 0;

  return (
    <div>
      <input ref={pickerRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      <input ref={submissionRef} type="file" name={nuevosFieldName} multiple className="hidden" />
      {[...removidos].map((id) => <input key={id} type="hidden" name={eliminarFieldName} value={id} />)}

      {hayContenido && (
        <ul className="space-y-2">
          {existentes.map((a) => {
            const marcado = removidos.has(a.id);
            return (
              <li
                key={a.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                  marcado ? "border-red-100 bg-red-50/60" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cpe-navy/5 text-[10px] font-bold text-cpe-navy">
                    {extBadge(a.nombre)}
                  </span>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`truncate font-medium ${marcado ? "text-slate-400 line-through" : "text-cpe-navy hover:underline"}`}
                  >
                    {a.nombre}
                  </a>
                </div>
                <button type="button" onClick={() => toggleRemovido(a.id)} className="shrink-0 cursor-pointer text-xs font-semibold text-red-500 hover:text-red-600 hover:underline">
                  {marcado ? "Deshacer" : "Quitar"}
                </button>
              </li>
            );
          })}
          {nuevos.map((file, idx) => (
            <li key={`${file.name}-${idx}`} className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-2.5 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-600/10 text-[10px] font-bold text-emerald-700">
                  {extBadge(file.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-cpe-navy">{file.name}</p>
                  <p className="text-[11px] text-slate-400">{formatSize(file.size)} · nuevo</p>
                </div>
              </div>
              <button type="button" onClick={() => removeNuevo(idx)} className="shrink-0 cursor-pointer text-xs font-semibold text-red-500 hover:text-red-600 hover:underline">
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => pickerRef.current?.click()}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-cpe-royal/40 hover:text-cpe-royal ${hayContenido ? "mt-3" : ""}`}
      >
        + Agregar archivos
      </button>
    </div>
  );
}

/** Selector de un único archivo (ej. un PDF), con chip elegante y opción de reemplazar. */
export function ArchivoUnicoInput({
  name,
  accept,
  defaultUrl,
  defaultNombre,
}: {
  name: string;
  accept?: string;
  defaultUrl?: string | null;
  defaultNombre?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-cpe-royal/40 hover:text-cpe-royal"
        >
          Seleccionar archivo
        </button>

        {file ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2 text-sm">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600/10 text-[10px] font-bold text-emerald-700">
              {extBadge(file.name)}
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
        ) : defaultUrl ? (
          <a
            href={defaultUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-cpe-navy transition hover:border-cpe-royal/40"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cpe-navy/5 text-[10px] font-bold text-cpe-navy">
              {extBadge(defaultNombre ?? defaultUrl)}
            </span>
            <span className="font-medium">Archivo actual — ver ↗</span>
          </a>
        ) : (
          <span className="text-sm text-slate-400">Ningún archivo seleccionado</span>
        )}
      </div>
    </div>
  );
}
