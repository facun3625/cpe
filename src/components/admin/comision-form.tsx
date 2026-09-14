import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";

type ComisionFormValues = { titulo?: string; texto?: string; tramitesRelacionados?: string[]; orden?: number };

export function ComisionForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ComisionFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Título">
        <TextInput name="titulo" required defaultValue={defaultValues?.titulo} />
      </Field>
      <Field label="Texto">
        <TextArea name="texto" rows={3} required defaultValue={defaultValues?.texto} />
      </Field>
      <Field label="Trámites relacionados (uno por línea, opcional)">
        <TextArea name="tramitesRelacionados" rows={4} defaultValue={(defaultValues?.tramitesRelacionados ?? []).join("\n")} />
      </Field>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
