import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as planilla from "../src/lib/nomenclador/planilla";
import * as config from "../src/lib/nomenclador/config";

const code = ts.transpileModule(readFileSync("src/app/admin/nomenclador/actions.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup({ authenticated = true, fail = false } = {}) {
  let items: unknown[] = [{ nombre: "Anterior" }];
  let contenido: unknown = null;
  let writes = 0;
  const dependencies: Record<string, unknown> = {
    "@/auth": { auth: async () => authenticated ? { user: {} } : null },
    "next/cache": { revalidatePath() {} },
    "@/lib/nomenclador/config": config,
    "@/lib/nomenclador/planilla": planilla,
    "@/lib/upload": { saveUploadedFile: async () => "/uploads/nomenclador/test.pdf" },
    "@/lib/prisma": { prisma: { async $transaction(callback: (tx: unknown) => Promise<void>) {
      writes++;
      let draftItems = [...items]; let draftConfig = contenido;
      await callback({
        paginaTexto: { async findUnique() { return { contenido }; }, async upsert({ update }: { update: { contenido: unknown } }) { draftConfig = update.contenido; } },
        nomencladorItem: {
          async deleteMany() { draftItems = []; },
          async createMany({ data }: { data: unknown[] }) { if (fail) throw new Error("DB failure"); draftItems = data; },
        },
      });
      items = draftItems; contenido = draftConfig;
    } } },
  };
  const exports: Record<string, (data: FormData) => Promise<Record<string, unknown>>> = {};
  vm.runInNewContext(code, { exports, require: (name: string) => { assert.ok(name in dependencies, name); return dependencies[name]; }, File, TextDecoder, Uint8Array });
  const data = new FormData();
  data.set("archivo", new File([readFileSync("public/ARANCELES/Aranceles Enero 2024-Tabla 1.csv")], "aranceles.csv"));
  return { actions: exports, data, items: () => items, config: () => contenido, writes: () => writes };
}

test("la vista previa no escribe y la publicación reemplaza todo en una transacción", async () => {
  const app = setup();
  assert.equal((await app.actions.revisarPlanilla(app.data)).total, 122);
  assert.equal(app.writes(), 0);
  assert.equal((await app.actions.publicarPlanilla(app.data)).ok, true);
  assert.equal(app.writes(), 1);
  assert.equal(app.items().length, 122);
  assert.equal(config.readNomencladorConfig(app.config()).valoresUpe.cd, 281.29);
});
test("una planilla inválida no borra las prestaciones anteriores", async () => {
  const app = setup(); app.data.set("archivo", new File(["vacio"], "invalido.csv"));
  assert.equal((await app.actions.publicarPlanilla(app.data)).ok, false);
  assert.equal(app.writes(), 0);
  assert.deepEqual(app.items(), [{ nombre: "Anterior" }]);
});
test("un error de base de datos revierte el reemplazo completo", async () => {
  const app = setup({ fail: true });
  assert.equal((await app.actions.publicarPlanilla(app.data)).ok, false);
  assert.deepEqual(app.items(), [{ nombre: "Anterior" }]);
});
test("rechaza acciones sin sesión y PDFs falsos antes de publicar", async () => {
  const unauthenticated = setup({ authenticated: false });
  await assert.rejects(unauthenticated.actions.publicarPlanilla(unauthenticated.data), /sesión/);
  assert.equal(unauthenticated.writes(), 0);
  const app = setup(); app.data.set("pdf", new File(["not a PDF"], "falso.pdf"));
  assert.equal((await app.actions.publicarPlanilla(app.data)).ok, false);
  assert.equal(app.writes(), 0);
});
test("guardar los cuatro valores UPE no reemplaza las prestaciones", async () => {
  const app = setup(); const data = new FormData();
  for (const { key } of config.AMBITOS) data.set(key, "$ 1.234,50");
  assert.equal((await app.actions.guardarValoresUpe(data)).ok, true);
  assert.deepEqual(app.items(), [{ nombre: "Anterior" }]);
  assert.equal(config.readNomencladorConfig(app.config()).valoresUpe.dd, 1234.5);
});
