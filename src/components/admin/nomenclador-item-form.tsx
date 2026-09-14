import { Field, TextInput, SubmitButton } from "@/components/admin/fields";

type ItemFormValues = { nombre?: string; tiempo?: string; upe?: number; cd?: number; cn?: number; dn?: number; noReconocida?: boolean; orden?: number };

export function NomencladorItemForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ItemFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Nombre de la prestación">
        <TextInput name="nombre" required defaultValue={defaultValues?.nombre} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tiempo (ej. «15'»)">
          <TextInput name="tiempo" required defaultValue={defaultValues?.tiempo} />
        </Field>
        <Field label="U.P.E.">
          <TextInput name="upe" type="number" required defaultValue={defaultValues?.upe} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Consultorio diurno ($)">
          <TextInput name="cd" type="number" step="0.01" required defaultValue={defaultValues?.cd} />
        </Field>
        <Field label="Consultorio nocturno / Domicilio diurno ($)">
          <TextInput name="cn" type="number" step="0.01" required defaultValue={defaultValues?.cn} />
        </Field>
        <Field label="Domicilio nocturno ($)">
          <TextInput name="dn" type="number" step="0.01" required defaultValue={defaultValues?.dn} />
        </Field>
      </div>
      <div className="flex items-center gap-2">
        <input id="noReconocida" name="noReconocida" type="checkbox" defaultChecked={defaultValues?.noReconocida ?? false} className="h-4 w-4 rounded border-gray-300" />
        <label htmlFor="noReconocida" className="text-sm text-gray-700">No corresponde a incumbencias de enfermería</label>
      </div>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
