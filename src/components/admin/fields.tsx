import { DeleteButton } from "@/components/admin/delete-button";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-cpe-royal focus:outline-none focus:ring-4 focus:ring-cpe-royal/10";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={inputClass} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} cursor-pointer`} />;
}

export function Toggle({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
      <span>
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
      </span>
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="cursor-pointer rounded-xl bg-cpe-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cpe-navy-light hover:shadow-md active:scale-[.98]"
    >
      {children}
    </button>
  );
}

export function Card({
  title,
  hint,
  action,
  children,
}: {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      {title && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cpe-royal">{title}</p>
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminTable({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: string }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            {head.map((h) => <th key={h} className="px-4 py-3.5 font-bold">{h}</th>)}
            <th className="px-4 py-3.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children}
          {empty && (
            <tr>
              <td colSpan={head.length + 1} className="px-4 py-10 text-center text-slate-400">{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function RowActions({
  editHref,
  deleteAction,
  confirmMessage = "¿Eliminar este elemento? Esta acción no se puede deshacer.",
}: {
  editHref?: string;
  deleteAction: () => void;
  confirmMessage?: string;
}) {
  return (
    <div className="flex justify-end gap-4">
      {editHref && <a href={editHref} className="text-sm font-medium text-cpe-blue hover:underline">Editar</a>}
      <DeleteButton action={deleteAction} confirmMessage={confirmMessage} />
    </div>
  );
}

export function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {action}
    </div>
  );
}

export function NewButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="rounded-xl bg-cpe-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cpe-navy-light hover:shadow-md">
      {children}
    </a>
  );
}
