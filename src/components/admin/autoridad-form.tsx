import { ImagenPortadaInput } from "@/components/admin/media-inputs";
import { Field, TextInput, Select, SubmitButton } from "@/components/admin/fields";

type AutoridadFormValues = {
  fotoUrl?: string | null;
  grupo?: string;
  rol?: string | null;
  nombre?: string;
  orden?: number;
};

const GRUPOS = [
  ["CONSEJO_DIRECTIVO", "Consejo directivo"],
  ["VOCAL_TITULAR", "Vocal titular"],
  ["VOCAL_SUPLENTE", "Vocal suplente"],
  ["SINDICO", "Síndico"],
  ["ETICA_TITULAR", "Tribunal de ética — titular"],
  ["ETICA_SUPLENTE", "Tribunal de ética — suplente"],
];

export function AutoridadForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: AutoridadFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Field label="Grupo">
        <Select name="grupo" required defaultValue={defaultValues?.grupo ?? "CONSEJO_DIRECTIVO"}>
          {GRUPOS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </Field>
      <Field label="Nombre (formato: Apellido, Nombre)">
        <TextInput name="nombre" required defaultValue={defaultValues?.nombre} placeholder="Azoge, Carlos Luis Rubén" />
      </Field>
      <Field label="Cargo (solo para Consejo directivo o Síndicos, ej. «Presidente»)">
        <TextInput rich name="rol" defaultValue={defaultValues?.rol ?? ""} />
      </Field>
      <Field label="Foto" hint="Se muestra en la tarjeta del Consejo directivo. Podés cargarla, reemplazarla o quitarla.">
        <ImagenPortadaInput name="foto" defaultUrl={defaultValues?.fotoUrl} />
      </Field>
      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
      </Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
