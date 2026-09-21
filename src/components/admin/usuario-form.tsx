import { Field, TextInput, SubmitButton, inputClass } from "@/components/admin/fields";
import { PasswordInput } from "@/components/password-input";

type UsuarioFormValues = { email?: string; name?: string | null };

export function UsuarioForm({
  action,
  defaultValues,
  submitLabel,
  esEdicion = false,
}: {
  action: (formData: FormData) => void;
  defaultValues?: UsuarioFormValues;
  submitLabel: string;
  esEdicion?: boolean;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Nombre (opcional)">
        <TextInput name="name" defaultValue={defaultValues?.name ?? ""} />
      </Field>
      <Field label="Email">
        <TextInput name="email" type="email" required defaultValue={defaultValues?.email} />
      </Field>
      <Field label={esEdicion ? "Nueva contraseña" : "Contraseña"} hint={esEdicion ? "Dejala vacía para no cambiarla. Mínimo 8 caracteres." : "Mínimo 8 caracteres."}>
        <PasswordInput name="password" required={!esEdicion} minLength={8} className={inputClass} autoComplete="new-password" />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
