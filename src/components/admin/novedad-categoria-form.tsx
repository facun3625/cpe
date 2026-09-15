import { Field, TextInput, SubmitButton } from "@/components/admin/fields";

type CategoriaFormValues = {
  nombre?: string;
  orden?: number;
};

export function NovedadCategoriaForm({
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
      <Field label="Nombre" hint="Ej: Sede Santa Fe, Delegación Rafaela, Artículos de Interés">
        <TextInput name="nombre" required defaultValue={defaultValues?.nombre} />
      </Field>

      <Field label="Orden" hint="Se muestran de menor a mayor en los filtros del sitio">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
