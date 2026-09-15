"use client";

export function DeleteButton({ action, confirmMessage }: { action: () => void; confirmMessage: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button type="submit" className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600 hover:underline">
        Eliminar
      </button>
    </form>
  );
}
