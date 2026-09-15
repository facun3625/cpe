"use client";

export function ConfirmDialog({
  open,
  title = "¿Confirmás?",
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-cpe-navy/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-lg font-bold text-cpe-navy">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-cpe-navy hover:bg-cpe-royal"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
