import { Field, TextInput, SubmitButton } from "@/components/admin/fields";

type CategoriaFormValues = {
  nombre?: string;
  orden?: number;
};

export function BibliotecaCategoriaForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: CategoriaFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-5">
      <Field label="Nombre" hint="Ej: Manuales, Revistas científicas, Guías de práctica clínica">
        <TextInput name="nombre" required defaultValue={defaultValues?.nombre} />
      </Field>

      <Field label="Orden" hint="Las categorías se muestran de menor a mayor">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
