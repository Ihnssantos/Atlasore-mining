import { getPool, sql } from '../config/db.js';

// Converte o tipo do campo para o tipo de parâmetro do mssql
function toSqlType(field) {
  switch (field.type) {
    case 'int':
      return sql.Int;
    case 'decimal':
      return sql.Decimal(field.precision, field.scale);
    case 'password':
      return sql.NVarChar(255);
    default:
      return sql.NVarChar(field.max);
  }
}

// Cria o repositório de um cadastro a partir da sua definição
// Os nomes de tabela e coluna vêm do código, e os valores entram sempre por parâmetros
export function createRepository({ table, fields }) {
  // A coluna tem o nome do campo, exceto quando a definição indica outro (como senha_hash)
  const columnOf = (field) => field.column ?? field.name;

  // Colunas devolvidas pela API, sem nunca incluir o hash da senha
  const returnedColumns = [
    'id',
    ...fields.filter((field) => field.type !== 'password').map(columnOf),
    'status',
  ];
  const selectList = returnedColumns.join(', ');
  const outputList = returnedColumns.map((column) => `inserted.${column}`).join(', ');

  // Declara um parâmetro na consulta para cada campo informado
  function addInputs(request, data, fieldsToBind) {
    fieldsToBind.forEach((field) => {
      request.input(field.name, toSqlType(field), data[field.name]);
    });
  }

  return {
    // Lista todos os registros do cadastro
    async findAll() {
      const pool = await getPool();
      const result = await pool.request().query(`SELECT ${selectList} FROM dbo.${table} ORDER BY id`);
      return result.recordset;
    },

    // Busca um registro pelo id e retorna undefined se não existir
    async findById(id) {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query(`SELECT ${selectList} FROM dbo.${table} WHERE id = @id`);
      return result.recordset[0];
    },

    // Insere um registro e devolve o que foi criado
    async create(data) {
      const pool = await getPool();
      const request = pool.request();
      addInputs(request, data, fields);

      const columns = fields.map(columnOf).join(', ');
      const params = fields.map((field) => `@${field.name}`).join(', ');
      const result = await request.query(
        `INSERT INTO dbo.${table} (${columns}) OUTPUT ${outputList} VALUES (${params})`
      );
      return result.recordset[0];
    },

    // Atualiza os campos e o status e devolve o registro, ou undefined se o id não existir
    async update(id, data, status) {
      const pool = await getPool();
      const request = pool.request().input('id', sql.Int, id).input('status', sql.Bit, status);

      // Senha não enviada significa manter a atual, então ela fica fora do UPDATE
      const updatedFields = fields.filter(
        (field) => field.type !== 'password' || data[field.name] !== null
      );
      addInputs(request, data, updatedFields);

      const assignments = [
        ...updatedFields.map((field) => `${columnOf(field)} = @${field.name}`),
        'status = @status',
      ].join(', ');
      const result = await request.query(
        `UPDATE dbo.${table} SET ${assignments} OUTPUT ${outputList} WHERE id = @id`
      );
      return result.recordset[0];
    },
  };
}
