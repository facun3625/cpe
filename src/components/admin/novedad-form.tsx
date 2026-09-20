import { Field, TextInput, TextArea, Select, SubmitButton, Card } from "@/components/admin/fields";
import { ImagenPortadaInput, GaleriaManager, ArchivosManager } from "@/components/admin/media-inputs";

type NovedadFormValues = {
  titulo?: string;
  resumen?: string;
  contenido?: string | null;
  categoria?: string;
  imagenUrl?: string | null;
  galeria?: string[];
  videoUrl?: string | null;
  publicada?: boolean;
  destacadaHome?: boolean;
  archivos?: { id: string; nombre: string; url: string }[];
};

export function NovedadForm({
  action,
  defaultValues,
  submitLabel,
  categorias,
}: {
  action: (formData: FormData) => void;
  defaultValues?: NovedadFormValues;
  submitLabel: string;
  categorias: string[];
}) {
  const galeria = defaultValues?.galeria ?? [];
  const archivos = defaultValues?.archivos ?? [];

  return (
    <form action={action} className="max-w-4xl space-y-6">
      <Card title="Contenido">
        <div className="space-y-5">
          <Field label="Título">
            <TextInput rich name="titulo" required defaultValue={defaultValues?.titulo} />
          </Field>

          <Field label="Resumen" hint="Se muestra en las cards y como bajada del artículo">
            <TextArea name="resumen" required rows={3} defaultValue={defaultValues?.resumen} />
          </Field>

          <Field label="Contenido completo" hint="Opcional — un párrafo por línea">
            <TextArea name="contenido" rows={8} defaultValue={defaultValues?.contenido ?? ""} />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Categoría">
              <Select name="categoria" defaultValue={defaultValues?.categoria ?? categorias[0]}>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>

            <Field label="Video" hint="Opcional — link de YouTube o Vimeo">
              <TextInput name="videoUrl" defaultValue={defaultValues?.videoUrl ?? ""} placeholder="https://www.youtube.com/watch?v=…" />
            </Field>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card title="Imagen de portada">
            <ImagenPortadaInput name="imagen" defaultUrl={defaultValues?.imagenUrl} />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Publicación">
            <label className="flex cursor-pointer items-center gap-3">
              <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                <input
                  type="checkbox"
                  name="publicada"
                  defaultChecked={defaultValues?.publicada ?? true}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500" />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </span>
              <span className="text-sm font-medium text-slate-700">Publicada</span>
            </label>
            <p className="mt-2 text-xs text-slate-400">Si está apagada, la novedad queda guardada pero no es visible en el sitio.</p>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                <input
                  type="checkbox"
                  name="destacadaHome"
                  defaultChecked={defaultValues?.destacadaHome ?? false}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-cpe-gold" />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </span>
              <span className="text-sm font-medium text-slate-700">Destacada en portada</span>
            </label>
            <p className="mt-2 text-xs text-slate-400">Marcá hasta 4 novedades para que aparezcan en el home. Si ninguna está marcada, se muestran las 4 más recientes.</p>
          </Card>
        </div>
      </div>

      <Card title="Galería de imágenes" hint="Podés seleccionar varias, se muestran como carrusel en el sitio. Arrastrá para reordenar.">
        <GaleriaManager nuevasFieldName="galeriaNuevas" ordenFieldName="galeriaOrden" existentes={galeria} />
      </Card>

      <Card title="Archivos adjuntos" hint="PDFs u otros documentos disponibles para descargar en la nota">
        <ArchivosManager nuevosFieldName="archivosNuevos" eliminarFieldName="archivosEliminar" existentes={archivos} />
      </Card>

      <div className="flex justify-end">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
