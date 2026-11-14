import { getPool, sql } from '../config/db.js';

// Os valores entram na consulta por parâmetros (@nome, @id), o que impede SQL injection

// Lista todos os tipos de equipamento ordenados pelo nome
export async function findAll() {
  const pool = await getPool();
  const result = await pool
    .request()
    .query('SELECT id, nome, status FROM dbo.tipos_equipamento ORDER BY nome');

  return result.recordset;
}

// Busca um tipo pelo id e retorna undefined se não existir
export async function findById(id) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('SELECT id, nome, status FROM dbo.tipos_equipamento WHERE id = @id');

  return result.recordset[0];
}

// Insere um novo tipo e devolve o registro criado
export async function create(nome) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('nome', sql.NVarChar(50), nome)
    .query(`
      INSERT INTO dbo.tipos_equipamento (nome)
      OUTPUT inserted.id, inserted.nome, inserted.status
      VALUES (@nome)
    `);

  return result.recordset[0];
}

// Atualiza nome e status e devolve o registro atualizado, ou undefined se o id não existir
export async function update(id, nome, status) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('nome', sql.NVarChar(50), nome)
    .input('status', sql.Bit, status)
    .query(`
      UPDATE dbo.tipos_equipamento
      SET nome = @nome, status = @status
      OUTPUT inserted.id, inserted.nome, inserted.status
      WHERE id = @id
    `);

  return result.recordset[0];
}