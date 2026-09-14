import { SeccionItemForm } from "@/components/admin/seccion-item-form";
import { createSeccionItem } from "../../actions";

export default async function NuevaSeccionItemPage({ params }: { params: Promise<{ pagina: string }> }) {
  const { pagina } = await params;
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nueva card</h1>
      <div className="mt-6">
        <SeccionItemForm action={createSeccionItem.bind(null, pagina)} submitLabel="Crear" />
      </div>
    </div>
  );
}
