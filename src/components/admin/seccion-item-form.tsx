import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";

type SeccionItemFormValues = { titulo?: string; texto?: string; href?: string | null; orden?: number };

export function SeccionItemForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: SeccionItemFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Título">
        <TextInput rich name="titulo" required defaultValue={defaultValues?.titulo} />
      </Field>
      <Field label="Texto">
        <TextArea name="texto" rows={3} required defaultValue={defaultValues?.texto} />
      </Field>
      <Field label="Link (opcional, ej. /becas)">
        <TextInput name="href" defaultValue={defaultValues?.href ?? ""} />
      </Field>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
