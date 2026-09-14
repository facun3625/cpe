-- CreateEnum
CREATE TYPE "DocumentoTipo" AS ENUM ('DICTAMEN', 'REGLAMENTO', 'NOTA_MODELO', 'BECA');

-- CreateEnum
CREATE TYPE "AutoridadGrupo" AS ENUM ('CONSEJO_DIRECTIVO', 'VOCAL_TITULAR', 'VOCAL_SUPLENTE', 'SINDICO', 'ETICA_TITULAR', 'ETICA_SUPLENTE');

-- CreateEnum
CREATE TYPE "NivelMatricula" AS ENUM ('ENFERMERO', 'LICENCIADO', 'AUXILIAR');

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "tipo" "DocumentoTipo" NOT NULL,
    "titulo" TEXT NOT NULL,
    "grupo" TEXT,
    "archivoUrl" TEXT,
    "noReconocida" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tramite" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "requisitos" TEXT[],
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comision" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tramitesRelacionados" TEXT[],
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autoridad" (
    "id" TEXT NOT NULL,
    "grupo" "AutoridadGrupo" NOT NULL,
    "rol" TEXT,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Autoridad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitoHistoria" (
    "id" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HitoHistoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefonos" TEXT[],
    "horario" TEXT NOT NULL,
    "email" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NomencladorItem" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tiempo" TEXT NOT NULL,
    "upe" INTEGER NOT NULL,
    "cd" DOUBLE PRECISION NOT NULL,
    "cn" DOUBLE PRECISION NOT NULL,
    "dn" DOUBLE PRECISION NOT NULL,
    "noReconocida" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NomencladorItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeccionItem" (
    "id" TEXT NOT NULL,
    "pagina" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "href" TEXT,
    "tag" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeccionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaginaTexto" (
    "id" TEXT NOT NULL,
    "pagina" TEXT NOT NULL,
    "contenido" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaginaTexto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matriculado" (
    "id" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nivel" "NivelMatricula" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matriculado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tramite_slug_key" ON "Tramite"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PaginaTexto_pagina_key" ON "PaginaTexto"("pagina");

-- CreateIndex
CREATE UNIQUE INDEX "Matriculado_dni_key" ON "Matriculado"("dni");
