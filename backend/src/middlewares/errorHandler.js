// Códigos do SQL Server para violação de chave única
const DUPLICATE_KEY_ERRORS = [2601, 2627];

// Código do SQL Server para violação de chave estrangeira
const FOREIGN_KEY_ERROR = 547;

// Trata qualquer erro das rotas e responde sempre no mesmo formato
// O parâmetro next precisa existir para o Express reconhecer este handler de erros
export function errorHandler(error, req, res, next) {
  // JSON malformado enviado pelo cliente
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido' });
  }

  if (DUPLICATE_KEY_ERRORS.includes(error.number)) {
    return res.status(409).json({ message: 'Já existe um registro com esse valor' });
  }

  if (error.number === FOREIGN_KEY_ERROR) {
    return res.status(400).json({ message: 'O registro relacionado informado não existe' });
  }

  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
}
