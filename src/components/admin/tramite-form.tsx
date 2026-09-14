import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";

type TramiteFormValues = { titulo?: string; texto?: string; requisitos?: string[]; orden?: number; slug?: string };

export function TramiteForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: TramiteFormValues;
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
      <Field label="Requisitos (uno por línea)">
        <TextArea name="requisitos" rows={5} defaultValue={(defaultValues?.requisitos ?? []).join("\n")} />
      </Field>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      {defaultValues?.slug && (
        <p className="text-xs text-slate-500">
          Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5">{defaultValues.slug}</code> — usalo como «Grupo» al cargar la nota modelo de este trámite en Documentos.
        </p>
      )}
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
