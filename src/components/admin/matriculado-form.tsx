import { Field, TextInput, Select, SubmitButton } from "@/components/admin/fields";

type MatriculadoFormValues = {
  apellido?: string;
  nombre?: string;
  dni?: string;
  matricula?: string;
  nivel?: string;
};

export function MatriculadoForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: MatriculadoFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Apellido">
          <TextInput name="apellido" required defaultValue={defaultValues?.apellido} />
        </Field>
        <Field label="Nombre">
          <TextInput name="nombre" required defaultValue={defaultValues?.nombre} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="DNI">
          <TextInput name="dni" required defaultValue={defaultValues?.dni} />
        </Field>
        <Field label="Matrícula">
          <TextInput name="matricula" required defaultValue={defaultValues?.matricula} />
        </Field>
      </div>
      <Field label="Nivel">
        <Select name="nivel" defaultValue={defaultValues?.nivel ?? "ENFERMERO"}>
          <option value="ENFERMERO">Enfermero/a</option>
          <option value="LICENCIADO">Lic. en Enfermería</option>
          <option value="AUXILIAR">Aux. de Enfermería</option>
        </Select>
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
