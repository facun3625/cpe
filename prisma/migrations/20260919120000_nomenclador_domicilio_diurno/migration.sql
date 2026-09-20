ALTER TABLE "NomencladorItem" ADD COLUMN "dd" DOUBLE PRECISION;

UPDATE "NomencladorItem" SET "dd" = "cn";
