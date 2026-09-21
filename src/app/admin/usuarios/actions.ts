"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

function revalidateTodo() {
  revalidatePath("/admin/usuarios");
}

export async function createUsuario(formData: FormData) {
  await requireSession();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) throw new Error("Email y contraseña son obligatorios");
  if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres");

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) throw new Error("Ya existe un usuario con ese email");

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, name: name || null, passwordHash } });

  revalidateTodo();
  redirect("/admin/usuarios");
}

export async function updateUsuario(id: string, formData: FormData) {
  await requireSession();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) throw new Error("El email es obligatorio");
  if (password && password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres");

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente && existente.id !== id) throw new Error("Ya existe un usuario con ese email");

  await prisma.user.update({
    where: { id },
    data: {
      email,
      name: name || null,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });

  revalidateTodo();
  redirect("/admin/usuarios");
}

export async function deleteUsuario(id: string) {
  const session = await requireSession();

  if (session.user?.id === id) throw new Error("No podés eliminar tu propio usuario mientras estás conectado.");

  const total = await prisma.user.count();
  if (total <= 1) throw new Error("No podés eliminar el último usuario administrador.");

  await prisma.user.delete({ where: { id } });
  revalidateTodo();
}
