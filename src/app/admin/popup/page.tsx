import { prisma } from "@/lib/prisma";
import { Field, TextInput, TextArea, Select, SubmitButton, Card, Toggle } from "@/components/admin/fields";
import { ImagenPortadaInput } from "@/components/admin/media-inputs";
import { guardarPopup } from "./actions";

const TIPOS = [
  { value: "TEXTO", label: "Solo texto" },
  { value: "IMAGEN", label: "Imagen" },
  { value: "VIDEO", label: "Video" },
];

export default async function AdminPopupPage() {
  let config: Awaited<ReturnType<typeof prisma.popupConfig.findUnique>> = null;
  try {
    config = await prisma.popupConfig.findUnique({ where: { id: "global" } });
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Pop-up de bienvenida</h1>
      <p className="mt-2 text-sm text-slate-500">
        Un mensaje que aparece al entrar al sitio. Podés usarlo para avisos, promociones o novedades importantes.
      </p>

      <form action={guardarPopup} className="mt-6 max-w-3xl space-y-6">
        <Card title="Activación">
          <div className="space-y-5">
            <Toggle name="activo" defaultChecked={config?.activo ?? false} label="Pop-up activo" hint="Si está apagado, no se muestra en el sitio aunque el resto esté configurado." />
            <Toggle
              name="mostrarSiempre"
              defaultChecked={config?.mostrarSiempre ?? false}
              label="Mostrar en cada visita"
              hint="Apagado (recomendado): el sitio recuerda al visitante y le muestra el pop-up una sola vez. Encendido: aparece cada vez que alguien entra al sitio."
            />
          </div>
        </Card>

        <Card title="Contenido">
          <div className="space-y-5">
            <Field label="Tipo de contenido">
              <Select name="tipo" defaultValue={config?.tipo ?? "TEXTO"}>
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </Field>

            <Field label="Título" hint="Opcional">
              <TextInput name="titulo" defaultValue={config?.titulo ?? ""} />
            </Field>

            <Field label="Texto" hint="Opcional — se muestra debajo del título (y de la imagen o video, si elegiste esos tipos)">
              <TextArea name="texto" rows={4} defaultValue={config?.texto ?? ""} />
            </Field>

            <Field label="Imagen" hint="Se usa si elegiste el tipo “Imagen”">
              <ImagenPortadaInput name="imagen" defaultUrl={config?.imagenUrl} />
            </Field>

            <Field label="Video" hint="Se usa si elegiste el tipo “Video” — link de YouTube o Vimeo">
              <TextInput name="videoUrl" defaultValue={config?.videoUrl ?? ""} placeholder="https://www.youtube.com/watch?v=…" />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end">
          <SubmitButton>Guardar cambios</SubmitButton>
        </div>
      </form>
    </div>
  );
}
