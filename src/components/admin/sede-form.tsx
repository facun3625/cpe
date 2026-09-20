import { Field, TextInput, TextArea, SubmitButton } from "@/components/admin/fields";

type SedeFormValues = { nombre?: string; direccion?: string; telefonos?: string[]; horario?: string; email?: string | null; orden?: number };

export function SedeForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: SedeFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Nombre">
        <TextInput rich name="nombre" required defaultValue={defaultValues?.nombre} />
      </Field>
      <Field label="Dirección">
        <TextInput rich name="direccion" required defaultValue={defaultValues?.direccion} />
      </Field>
      <Field label="Teléfonos (uno por línea, opcional)">
        <TextArea rich={false} name="telefonos" rows={3} defaultValue={(defaultValues?.telefonos ?? []).join("\n")} />
      </Field>
      <Field label="Horario">
        <TextInput rich name="horario" required defaultValue={defaultValues?.horario} />
      </Field>
      <Field label="Email (opcional)">
        <TextInput name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
      </Field>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
