import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const suscriptores = await prisma.suscriptor.findMany({ orderBy: { createdAt: "desc" } });
  const filas = ["email,fecha_alta", ...suscriptores.map((s) => `${s.email},${s.createdAt.toISOString()}`)];
  const csv = filas.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=suscriptores.csv",
    },
  });
}
