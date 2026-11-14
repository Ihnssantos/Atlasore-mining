import { getPool } from '../config/db.js';

// Confirma que a API consegue consultar o banco de dados
export async function checkHealth(req, res) {
  try {
    // Pergunta ao banco qual é o seu nome
    const pool = await getPool();
    const result = await pool.request().query('SELECT DB_NAME() AS database_name');

    res.json({ status: 'ok', database: result.recordset[0].database_name });
  } catch (error) {
    // Registra o erro no terminal e avisa quem chamou a API
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}