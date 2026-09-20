"use client";

import { plainText } from "@/lib/rich-text";

import { useState } from "react";
import { RowActions } from "@/components/admin/fields";

type Item = {
  id: string;
  nombre: string;
  tiempo: string;
  cd: number;
  cn: number;
  dn: number;
  actualizadoDisplay: string;
};

type Campo = "cd" | "cn" | "dn";
type Estado = "idle" | "pending" | "ok" | "error";

function numero(v: string): number | null {
  const n = Number(v.trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const ETIQUETA_BOTON: Record<Estado, string> = {
  idle: "Guardar",
  pending: "Guardando…",
  ok: "✓ Guardado",
  error: "Valor inválido",
};

export function NomencladorFila({
  item,
  updateAction,
  deleteAction,
}: {
  item: Item;
  updateAction: (id: string, formData: FormData) => Promise<{ ok: true; actualizadoDisplay: string }>;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [textos, setTextos] = useState({ cd: String(item.cd), cn: String(item.cn), dn: String(item.dn) });
  const [guardados, setGuardados] = useState({ cd: item.cd, cn: item.cn, dn: item.dn });
  const [actualizadoEn, setActualizadoEn] = useState(item.actualizadoDisplay);
  const [estado, setEstado] = useState<Estado>("idle");

  const dirty = textos.cd !== String(guardados.cd) || textos.cn !== String(guardados.cn) || textos.dn !== String(guardados.dn);

  function cambiar(campo: Campo, valor: string) {
    setTextos((t) => ({ ...t, [campo]: valor }));
    if (estado !== "idle") setEstado("idle");
  }

  function revertir() {
    setTextos({ cd: String(guardados.cd), cn: String(guardados.cn), dn: String(guardados.dn) });
    setEstado("idle");
  }

  async function guardar() {
    const cd = numero(textos.cd);
    const cn = numero(textos.cn);
    const dn = numero(textos.dn);
    if (cd === null || cn === null || dn === null) {
      setEstado("error");
      return;
    }

    setEstado("pending");
    const fd = new FormData();
    fd.set("cd", String(cd));
    fd.set("cn", String(cn));
    fd.set("dn", String(dn));

    try {
      const res = await updateAction(item.id, fd);
      setGuardados({ cd, cn, dn });
      setTextos({ cd: String(cd), cn: String(cn), dn: String(dn) });
      setActualizadoEn(res.actualizadoDisplay);
      setEstado("ok");
      setTimeout(() => setEstado((e) => (e === "ok" ? "idle" : e)), 2500);
    } catch {
      setEstado("error");
    }
  }

  function tecla(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      guardar();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      revertir();
    }
  }

  function inputClass(campo: Campo) {
    const cambiado = textos[campo] !== String(guardados[campo]);
    return `w-24 rounded-lg border bg-white px-2 py-1.5 text-sm tabular-nums text-gray-700 outline-none transition focus:border-cpe-royal focus:ring-2 focus:ring-cpe-royal/15 ${
      cambiado ? "border-amber-300 bg-amber-50/70" : "border-slate-200"
    }`;
  }

  const botonDeshabilitado = !dirty || estado === "pending";

  function botonClass() {
    if (estado === "ok") return "bg-emerald-50 text-emerald-600";
    if (estado === "error") return "bg-red-50 text-red-500";
    if (dirty) return "bg-cpe-navy text-white shadow-sm hover:bg-cpe-navy-light";
    return "bg-slate-100 text-slate-400";
  }

  return (
    <tr className={dirty ? "bg-amber-50/30" : undefined}>
      <td className="px-4 py-3 font-medium text-gray-900">{plainText(item.nombre)}</td>
      <td className="px-4 py-3 text-gray-600">{item.tiempo}</td>
      {(["cd", "cn", "dn"] as const).map((campo) => (
        <td key={campo} className="px-4 py-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={textos[campo]}
              onChange={(e) => cambiar(campo, e.target.value)}
              onKeyDown={tecla}
              className={inputClass(campo)}
            />
          </div>
        </td>
      ))}
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{actualizadoEn}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={revertir}
            disabled={botonDeshabilitado}
            className="cursor-pointer text-xs font-medium text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:text-slate-200"
          >
            Deshacer
          </button>

          <button
            type="button"
            onClick={guardar}
            disabled={botonDeshabilitado}
            className={`w-28 shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:shadow-none ${botonClass()}`}
          >
            {ETIQUETA_BOTON[estado]}
          </button>

          <RowActions deleteAction={deleteAction.bind(null, item.id)} />
        </div>
      </td>
    </tr>
  );
}
