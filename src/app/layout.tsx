import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULTS = {
  titulo: "Colegio de Profesionales en Enfermería de Santa Fe",
  descripcion:
    "El Colegio de Profesionales en Enfermería de Santa Fe acompaña a los profesionales, brindando información, formación, trámites y servicios para toda la comunidad de enfermería de la provincia.",
};

export async function generateMetadata(): Promise<Metadata> {
  let config: Awaited<ReturnType<typeof prisma.seoConfig.findUnique>> = null;
  try {
    config = await prisma.seoConfig.findUnique({ where: { id: "global" } });
  } catch {}

  const titulo = config?.titulo || DEFAULTS.titulo;
  const descripcion = config?.descripcion || DEFAULTS.descripcion;
  const palabrasClave = config?.palabrasClave
    ? config.palabrasClave.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;
  const imagenOg = config?.imagenOg || "/logo_final.png";

  return {
    title: titulo,
    description: descripcion,
    keywords: palabrasClave,
    openGraph: {
      title: titulo,
      description: descripcion,
      images: [imagenOg],
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagenOg],
      site: config?.twitterHandle || undefined,
    },
    verification: {
      google: config?.verificacionGoogle || undefined,
      other: config?.verificacionBing ? { "msvalidate.01": config.verificacionBing } : undefined,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
