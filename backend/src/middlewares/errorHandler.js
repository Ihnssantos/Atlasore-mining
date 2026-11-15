import { HttpError } from '../errors/HttpError.js';

// Códigos do SQL Server para violação de chave única
const DUPLICATE_KEY_ERRORS = [2601, 2627];

// Código do SQL Server para violação de chave estrangeira ou de CHECK
const CONSTRAINT_ERROR = 547;

// Trata qualquer erro das rotas e responde sempre no mesmo formato
// O parâmetro next precisa existir para o Express reconhecer este handler de erros
export function errorHandler(error, req, res, next) {
  // Erros lançados pelo próprio código com um status definido
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }

  // JSON malformado enviado pelo cliente
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido' });
  }

  if (DUPLICATE_KEY_ERRORS.includes(error.number)) {
    return res.status(409).json({ message: 'Já existe um registro com esse valor' });
  }

  // As restrições do projeto de CHECK começam com CK_, e as demais são chaves estrangeiras
  if (error.number === CONSTRAINT_ERROR) {
    const isCheck = error.message.includes('CK_');
    const message = isCheck
      ? 'Os valores informados não são válidos'
      : 'O registro relacionado informado não existe';
    return res.status(400).json({ message });
  }

  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
}
