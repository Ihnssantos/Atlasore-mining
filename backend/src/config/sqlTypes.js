import { sql } from './db.js';

// Converte o tipo do campo para o tipo de parâmetro do mssql
export function toSqlType(field) {
  switch (field.type) {
    case 'int':
      return sql.Int;
    case 'decimal':
      return sql.Decimal(field.precision, field.scale);
    case 'datetime':
      return sql.DateTime2(0);
    case 'password':
      return sql.NVarChar(255);
    default:
      return sql.NVarChar(field.max);
  }
}
