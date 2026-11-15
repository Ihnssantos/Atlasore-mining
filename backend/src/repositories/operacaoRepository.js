import { getPool, sql } from '../config/db.js';
import { toSqlType } from '../config/sqlTypes.js';
import { HttpError } from '../errors/HttpError.js';

const REFERENCE_NOT_FOUND = 'O registro relacionado informado não existe';

// Cria o repositório de um registro da gestão operacional a partir da sua definição
// Os nomes de tabela, view e coluna vêm do código, e os valores entram sempre por parâmetros
export function createOperacaoRepository({ table, view, periodColumn, fields, derived }) {
  // Tipo de cada coluna gravável: campos enviados pelo cliente e campos preenchidos pela API
  const typeByName = {};
  fields.forEach((field) => {
    typeByName[field.name] = toSqlType(field);
  });
  derived.forEach((rule) => {
    typeByName[rule.field] = sql.Int;
  });

  // Declara um parâmetro na consulta para cada valor que será gravado
  function addInputs(request, values) {
    Object.entries(values).forEach(([name, value]) => {
      request.input(name, typeByName[name], value);
    });
  }

  // Busca nos cadastros os valores que a API preenche, a partir dos ids enviados
  // Em atualização parcial, só resolve as regras cujo id de origem foi enviado
  async function resolveDerived(pool, data) {
    const resolved = {};

    for (const rule of derived) {
      const sourceId = data[rule.from];
      if (sourceId === undefined) {
        continue;
      }

      const result = await pool
        .request()
        .input('id', sql.Int, sourceId)
        .query(`SELECT ${rule.column} AS value FROM dbo.${rule.table} WHERE id = @id`);

      if (result.recordset.length === 0) {
        throw new HttpError(400, REFERENCE_NOT_FOUND);
      }
      resolved[rule.field] = result.recordset[0].value;
    }

    return resolved;
  }

  // Busca um registro pelo id na view e retorna undefined se não existir
  async function findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM dbo.${view} WHERE id = @id`);
    return result.recordset[0];
  }

  return {
    findById,

    // Lista os registros do período e aplica os filtros informados
    async findByPeriod(from, to, filterValues) {
      const pool = await getPool();
      const request = pool.request().input('from', sql.DateTime2(0), from).input('to', sql.DateTime2(0), to);

      const conditions = [`${periodColumn} >= @from`, `${periodColumn} <= @to`];
      for (const [name, value] of Object.entries(filterValues)) {
        request.input(name, sql.Int, value);
        conditions.push(`${name} = @${name}`);
      }

      const result = await request.query(
        `SELECT * FROM dbo.${view} WHERE ${conditions.join(' AND ')} ORDER BY ${periodColumn}, id`
      );
      return result.recordset;
    },

    // Grava um novo registro na tabela e devolve o registro como a view mostra
    async create(data) {
      const pool = await getPool();
      const values = { ...data, ...(await resolveDerived(pool, data)) };
      const names = Object.keys(values);

      const request = pool.request();
      addInputs(request, values);

      const result = await request.query(
        `INSERT INTO dbo.${table} (${names.join(', ')})
         OUTPUT inserted.id
         VALUES (${names.map((name) => `@${name}`).join(', ')})`
      );
      return findById(result.recordset[0].id);
    },

    // Atualiza só os campos enviados, registra quem e quando alterou e devolve o registro atualizado
    // Retorna undefined se o id não existir
    async update(id, data, userId) {
      const pool = await getPool();
      const values = { ...data, ...(await resolveDerived(pool, data)) };

      const request = pool.request().input('id', sql.Int, id).input('userId', sql.Int, userId ?? null);
      addInputs(request, values);

      const assignments = [
        ...Object.keys(values).map((name) => `${name} = @${name}`),
        'atualizado_em = SYSDATETIME()',
        'atualizado_por = @userId',
      ].join(', ');
      const result = await request.query(`UPDATE dbo.${table} SET ${assignments} WHERE id = @id`);

      if (result.rowsAffected[0] === 0) {
        return undefined;
      }
      return findById(id);
    },

    // Apaga o registro e informa se ele existia
    async remove(id) {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM dbo.${table} WHERE id = @id`);
      return result.rowsAffected[0] > 0;
    },
  };
}
