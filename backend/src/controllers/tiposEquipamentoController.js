import * as repository from '../repositories/tiposEquipamentoRepository.js';

// Tamanho máximo da coluna nome no banco
const NAME_MAX_LENGTH = 50;

// Confere se o id da URL é um número inteiro positivo
function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

// Confere se o nome é um texto preenchido e cabe na coluna
function isValidName(nome) {
  return (
    typeof nome === 'string' &&
    nome.trim().length > 0 &&
    nome.trim().length <= NAME_MAX_LENGTH
  );
}

// Lista todos os tipos de equipamento
export async function list(req, res) {
  const tipos = await repository.findAll();
  res.json(tipos);
}

// Busca um tipo de equipamento pelo id da URL
export async function getById(req, res) {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Id inválido' });
  }

  const tipo = await repository.findById(id);
  if (!tipo) {
    return res.status(404).json({ message: 'Tipo de equipamento não encontrado' });
  }

  res.json(tipo);
}

// Cria um tipo de equipamento com o nome enviado no corpo da requisição
export async function create(req, res) {
  const { nome } = req.body;
  if (!isValidName(nome)) {
    return res.status(400).json({ message: 'Nome inválido' });
  }

  const tipo = await repository.create(nome.trim());
  res.status(201).json(tipo);
}

// Atualiza nome e status, e para inativar basta enviar status false
export async function update(req, res) {
  const id = Number(req.params.id);
  const { nome, status } = req.body;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'Id inválido' });
  }
  if (!isValidName(nome) || typeof status !== 'boolean') {
    return res.status(400).json({ message: 'Nome ou status inválido' });
  }

  const tipo = await repository.update(id, nome.trim(), status);
  if (!tipo) {
    return res.status(404).json({ message: 'Tipo de equipamento não encontrado' });
  }

  res.json(tipo);
}