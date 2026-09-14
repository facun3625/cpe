-- AlterTable
ALTER TABLE "Novedad" ADD COLUMN     "contenido" TEXT,
ADD COLUMN     "galeria" TEXT[],
ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "NovedadArchivo" (
    "id" TEXT NOT NULL,
    "novedadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NovedadArchivo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NovedadArchivo" ADD CONSTRAINT "NovedadArchivo_novedadId_fkey" FOREIGN KEY ("novedadId") REFERENCES "Novedad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
