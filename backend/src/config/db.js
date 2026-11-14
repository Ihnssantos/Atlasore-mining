import 'dotenv/config';
import sql from 'mssql';

// Dados de conexão lidos do arquivo .env
const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    // Aceita o certificado local do SQL Server, usar apenas em desenvolvimento
    trustServerCertificate: true,
  },
};

// Guarda o pool para existir apenas um em toda a aplicação
let poolPromise;

// Retorna o pool de conexões, criando-o na primeira chamada
export function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config).connect().catch((error) => {
      // Zera a variável para a próxima chamada tentar conectar de novo
      poolPromise = null;
      throw error;
    });
  }
  return poolPromise;
}

// Reexporta os tipos do mssql para os repositórios declararem os parâmetros
export { sql };