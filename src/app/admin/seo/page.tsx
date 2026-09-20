import { prisma } from "@/lib/prisma";
import { Field, TextInput, TextArea, SubmitButton, Card } from "@/components/admin/fields";
import { ImagenPortadaInput } from "@/components/admin/media-inputs";
import { guardarSeo } from "./actions";

export default async function AdminSeoPage() {
  let config: Awaited<ReturnType<typeof prisma.seoConfig.findUnique>> = null;
  try {
    config = await prisma.seoConfig.findUnique({ where: { id: "global" } });
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">SEO del sitio</h1>
      <p className="mt-2 text-sm text-slate-500">
        Esto controla cómo se ve el sitio en Google y al compartirlo en redes sociales (WhatsApp, Facebook, etc.).
      </p>

      <form action={guardarSeo} className="mt-6 max-w-3xl space-y-6">
        <Card title="Básico">
          <div className="space-y-5">
            <Field label="Título del sitio" hint="Aparece en la pestaña del navegador y como título en los resultados de Google">
              <TextInput name="titulo" required defaultValue={config?.titulo ?? "Colegio de Profesionales en Enfermería de Santa Fe"} />
            </Field>

            <Field label="Descripción" hint="El resumen que Google muestra debajo del título en los resultados de búsqueda (ideal: 150-160 caracteres)">
              <TextArea rich={false} name="descripcion" rows={3} defaultValue={config?.descripcion ?? ""} />
            </Field>

            <Field label="Palabras clave" hint="Separadas por coma. Hoy tienen poco peso en Google, pero las sigue pidiendo alguna herramienta">
              <TextInput name="palabrasClave" defaultValue={config?.palabrasClave ?? ""} placeholder="enfermería, matrícula, santa fe, colegio de enfermería" />
            </Field>
          </div>
        </Card>

        <Card title="Al compartir en redes" hint="Imagen y datos que se muestran cuando alguien pega el link del sitio en WhatsApp, Facebook, Twitter/X, etc.">
          <div className="space-y-5">
            <Field label="Imagen para compartir" hint="Se recomienda 1200×630px. Si no se sube ninguna, se usa el logo">
              <ImagenPortadaInput name="imagenOg" defaultUrl={config?.imagenOg} />
            </Field>

            <Field label="Usuario de Twitter/X" hint="Opcional, con @">
              <TextInput name="twitterHandle" defaultValue={config?.twitterHandle ?? ""} placeholder="@cpesantafe" />
            </Field>
          </div>
        </Card>

        <Card title="Verificación de motores de búsqueda" hint="Opcional — solo si Google Search Console o Bing Webmaster te pidieron pegar un código">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Google Search Console">
              <TextInput name="verificacionGoogle" defaultValue={config?.verificacionGoogle ?? ""} placeholder="Código de verificación" />
            </Field>
            <Field label="Bing Webmaster Tools">
              <TextInput name="verificacionBing" defaultValue={config?.verificacionBing ?? ""} placeholder="Código de verificación" />
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
