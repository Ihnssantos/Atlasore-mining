// Códigos do SQL Server para violação de chave única
const DUPLICATE_KEY_ERRORS = [2601, 2627];

// Trata qualquer erro das rotas e responde sempre no mesmo formato
// O parâmetro next precisa existir para o Express reconhecer este handler de erros
export function errorHandler(error, req, res, next) {
  if (DUPLICATE_KEY_ERRORS.includes(error.number)) {
    return res.status(409).json({ message: 'Já existe um registro com esse nome' });
  }

  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
}