"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
    >
      Cerrar sesión
    </button>
  );
}
