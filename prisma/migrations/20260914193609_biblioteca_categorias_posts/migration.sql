-- CreateTable
CREATE TABLE "BibliotecaCategoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibliotecaCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibliotecaPost" (
    "id" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "bajada" TEXT NOT NULL,
    "portadaUrl" TEXT,
    "archivoUrl" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibliotecaPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BibliotecaPost" ADD CONSTRAINT "BibliotecaPost_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "BibliotecaCategoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
