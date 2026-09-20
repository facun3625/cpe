import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/app/admin/matriculados/actions.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function setup(rows, failOnDni) {
  let records = new Map([['1', { dni: '1' }], ['2', { dni: '2' }]]);
  let transactions = 0;
  const prisma = {
    async $transaction(callback) {
      transactions++;
      const draft = new Map(records);
      const result = await callback({ matriculado: {
        async findUnique({ where }) { return draft.get(where.dni); },
        async upsert({ where, create, update }) {
          if (where.dni === failOnDni) throw new Error('Database failure');
          draft.set(where.dni, draft.has(where.dni) ? { dni: where.dni, ...update } : create);
        },
        async deleteMany({ where }) {
          let count = 0;
          for (const dni of draft.keys()) if (!where.dni.notIn.includes(dni)) { draft.delete(dni); count++; }
          return { count };
        },
      } });
      records = draft;
      return result;
    },
  };
  const dependencies = {
    'next/cache': { revalidatePath() {} },
    'next/navigation': { redirect() { throw new Error('Unauthorized'); } },
    '@/auth': { auth: async () => ({ user: {} }) },
    '@/lib/prisma': { prisma },
    xlsx: { read: () => ({ Sheets: { first: {} }, SheetNames: ['first'] }), utils: { sheet_to_json: () => rows } },
  };
  const context = { exports: {}, require: (name) => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  }, Buffer };
  vm.runInNewContext(code, context);
  return {
    run: (modo = 'reemplazar') => context.exports.importarMatriculadosExcel(new Map([
      ['modo', modo], ['archivo', { name: 'padron.xlsx', size: 1, arrayBuffer: async () => new ArrayBuffer(1) }],
    ])),
    records: () => records,
    transactions: () => transactions,
  };
}
const valid = (dni) => ({ apellido: 'Apellido', nombre: 'Nombre', dni, matricula: '123', nivel: 'Licenciado' });

test('reemplazar con una fila incompleta no escribe ni elimina registros', async () => {
  const app = setup([valid('1'), { dni: '2', apellido: 'Incompleto' }]);
  const result = await app.run();
  assert.equal(app.transactions(), 0);
  assert.equal(app.records().size, 2);
  assert.equal(result.eliminados, 0);
  assert.ok(result.errores.length > 0);
});
test('reemplazar con archivo vacío no modifica el padrón', async () => {
  const app = setup([]);
  assert.ok((await app.run()).errores.length > 0);
  assert.equal(app.transactions(), 0);
});
test('reemplazo válido actualiza, crea y elimina los ausentes', async () => {
  const app = setup([valid('1'), valid('3')]);
  const result = await app.run();
  assert.equal(result.creados, 1);
  assert.equal(result.actualizados, 1);
  assert.equal(result.eliminados, 1);
  assert.deepEqual([...app.records().keys()], ['1', '3']);
});
test('agregar omite filas inválidas sin borrar registros existentes', async () => {
  const app = setup([valid('3'), { dni: '2' }]);
  const result = await app.run('agregar');
  assert.equal(result.omitidos, 1);
  assert.equal(result.eliminados, 0);
  assert.equal(app.records().size, 3);
});
test('un error de escritura aborta la transacción sin aplicar cambios parciales', async () => {
  const app = setup([valid('3'), valid('4')], '4');
  await assert.rejects(app.run(), /Database failure/);
  assert.deepEqual([...app.records().keys()], ['1', '2']);
});
