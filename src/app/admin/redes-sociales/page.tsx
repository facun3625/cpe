import { prisma } from "@/lib/prisma";
import { Field, TextInput, SubmitButton } from "@/components/admin/fields";
import { guardarRedesSociales } from "./actions";

type RedesContenido = { instagram?: string; facebook?: string; youtube?: string };

export default async function AdminRedesSocialesPage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const { guardado } = await searchParams;
  const registro = await prisma.paginaTexto.findUnique({ where: { pagina: "redes-sociales" } });
  const c = (registro?.contenido as RedesContenido | undefined) ?? {};

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Redes sociales</h1>
      <p className="mt-1 text-sm text-gray-500">Enlaces que se muestran en el encabezado y el pie del sitio. Dejá vacío el que no quieras mostrar.</p>
      {guardado && (
        <p role="status" className="mt-4 max-w-xl rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Cambios guardados.
        </p>
      )}
      <form action={guardarRedesSociales} className="mt-6 max-w-xl space-y-5">
        <Field label="Instagram">
          <TextInput name="instagram" type="url" placeholder="https://instagram.com/tu_cuenta" defaultValue={c.instagram ?? ""} />
        </Field>
        <Field label="Facebook">
          <TextInput name="facebook" type="url" placeholder="https://facebook.com/tu_pagina" defaultValue={c.facebook ?? ""} />
        </Field>
        <Field label="YouTube">
          <TextInput name="youtube" type="url" placeholder="https://youtube.com/@tu_canal" defaultValue={c.youtube ?? ""} />
        </Field>
        <SubmitButton>Guardar cambios</SubmitButton>
      </form>
    </div>
  );
}
