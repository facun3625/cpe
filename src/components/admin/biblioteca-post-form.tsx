import { plainText } from "@/lib/rich-text";
import { Field, TextInput, TextArea, Select, SubmitButton, Card } from "@/components/admin/fields";
import { ImagenPortadaInput, ArchivoUnicoInput } from "@/components/admin/media-inputs";

type PostFormValues = {
  categoriaId?: string;
  titulo?: string;
  bajada?: string;
  portadaUrl?: string | null;
  archivoUrl?: string | null;
  publicado?: boolean;
  orden?: number;
};

export function BibliotecaPostForm({
  action,
  categorias,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categorias: { id: string; nombre: string }[];
  defaultValues?: PostFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card title="Contenido">
        <div className="space-y-5">
          <Field label="Categoría">
            <Select name="categoriaId" required defaultValue={defaultValues?.categoriaId ?? ""}>
              <option value="" disabled>Elegí una categoría…</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Select>
          </Field>

          <Field label="Título">
            <TextInput rich name="titulo" required defaultValue={defaultValues?.titulo} />
          </Field>

          <Field label="Bajada" hint="Resumen corto que se muestra en la card">
            <TextArea name="bajada" required rows={3} defaultValue={defaultValues?.bajada} />
          </Field>

          <Field label="Orden" hint="De menor a mayor, dentro de su categoría">
            <TextInput name="orden" type="number" defaultValue={defaultValues?.orden ?? 0} />
          </Field>
        </div>
      </Card>

      <Card title="Portada">
        <ImagenPortadaInput name="portada" defaultUrl={defaultValues?.portadaUrl} />
      </Card>

      <Card title="Bibliografía" hint="Opcional — el PDF que se podrá descargar desde la card">
        <ArchivoUnicoInput name="archivo" accept="application/pdf" defaultUrl={defaultValues?.archivoUrl} defaultNombre={plainText(defaultValues?.titulo)} />
      </Card>

      <Card title="Publicación">
        <label className="flex cursor-pointer items-center gap-3">
          <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
            <input type="checkbox" name="publicado" defaultChecked={defaultValues?.publicado ?? true} className="peer sr-only" />
            <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500" />
            <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
          <span className="text-sm font-medium text-slate-700">Publicado</span>
        </label>
        <p className="mt-2 text-xs text-slate-400">Si está apagado, el post queda guardado pero no es visible en el sitio.</p>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
