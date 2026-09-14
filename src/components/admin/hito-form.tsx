import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";

type HitoFormValues = { anio?: string; titulo?: string; texto?: string; orden?: number };

export function HitoForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: HitoFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Año / etiqueta (ej. «1992», «Dic. 1996», «Hoy»)">
        <TextInput name="anio" required defaultValue={defaultValues?.anio} />
      </Field>
      <Field label="Título">
        <TextInput name="titulo" required defaultValue={defaultValues?.titulo} />
      </Field>
      <Field label="Texto">
        <TextArea name="texto" rows={4} required defaultValue={defaultValues?.texto} />
      </Field>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
