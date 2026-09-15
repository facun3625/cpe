"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function DeleteButton({ action, confirmMessage }: { action: () => void; confirmMessage: string }) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function confirmar() {
    setOpen(false);
    startTransition(() => {
      action();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600 hover:underline"
      >
        Eliminar
      </button>
      <ConfirmDialog open={open} message={confirmMessage} onConfirm={confirmar} onCancel={() => setOpen(false)} />
    </>
  );
}
