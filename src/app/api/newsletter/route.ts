import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: null }));

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 });
  }

  try {
    await prisma.suscriptor.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch {
    return NextResponse.json({ error: "No pudimos guardar tu suscripción. Probá de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
