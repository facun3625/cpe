-- CreateEnum
CREATE TYPE "PopupTipo" AS ENUM ('TEXTO', 'IMAGEN', 'VIDEO');

-- CreateTable
CREATE TABLE "SeoConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "titulo" TEXT NOT NULL DEFAULT 'Colegio de Profesionales en Enfermería de Santa Fe',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "palabrasClave" TEXT NOT NULL DEFAULT '',
    "imagenOg" TEXT,
    "twitterHandle" TEXT,
    "verificacionGoogle" TEXT,
    "verificacionBing" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PopupConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "tipo" "PopupTipo" NOT NULL DEFAULT 'TEXTO',
    "titulo" TEXT,
    "texto" TEXT,
    "imagenUrl" TEXT,
    "videoUrl" TEXT,
    "mostrarSiempre" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopupConfig_pkey" PRIMARY KEY ("id")
);
