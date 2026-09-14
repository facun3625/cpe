"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session) redirect("/login");
}

export async function deleteSuscriptor(id: string) {
  await requireSession();
  await prisma.suscriptor.delete({ where: { id } });
  revalidatePath("/admin/suscriptores");
}
