import { Field, TextInput, Select, SubmitButton } from "@/components/admin/fields";

type DocumentoFormValues = {
  titulo?: string;
  tipo?: string;
  grupo?: string | null;
  noReconocida?: boolean;
  archivoUrl?: string | null;
};

export function DocumentoForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: DocumentoFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Título">
        <TextInput rich name="titulo" required defaultValue={defaultValues?.titulo} />
      </Field>

      <Field label="Tipo">
        <Select name="tipo" required defaultValue={defaultValues?.tipo ?? "DICTAMEN"}>
          <option value="DICTAMEN">Dictamen</option>
          <option value="REGLAMENTO">Reglamento</option>
          <option value="NOTA_MODELO">Nota modelo (trámites)</option>
          <option value="BECA">Beca</option>
        </Select>
      </Field>

      <Field label="Grupo (para reglamentos: ej. «Marco legal»; para notas modelo: el slug del trámite)">
        <TextInput name="grupo" defaultValue={defaultValues?.grupo ?? ""} placeholder="Marco legal" />
      </Field>

      <div className="flex items-center gap-2">
        <input id="noReconocida" name="noReconocida" type="checkbox" defaultChecked={defaultValues?.noReconocida ?? false} className="h-4 w-4 rounded border-gray-300" />
        <label htmlFor="noReconocida" className="text-sm text-gray-700">No corresponde a incumbencias de enfermería (solo dictámenes)</label>
      </div>

      <Field label={defaultValues?.archivoUrl ? "Reemplazar archivo (PDF)" : "Archivo (PDF)"}>
        <input type="file" name="archivo" accept="application/pdf" className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-cpe-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
        {defaultValues?.archivoUrl && (
          <p className="mt-2 text-xs text-slate-500">
            Archivo actual: <a href={defaultValues.archivoUrl} target="_blank" rel="noreferrer" className="font-semibold text-cpe-blue hover:underline">verlo ↗</a>
          </p>
        )}
      </Field>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
