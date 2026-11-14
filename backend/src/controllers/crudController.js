import bcrypt from 'bcryptjs';
import { extractData, validateFields } from '../cadastros/fields.js';

// Custo do hash: quanto maior, mais seguro e mais lento
const HASH_ROUNDS = 10;

// Confere se o id da URL é um número inteiro positivo
function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

// Troca a senha em texto pelo hash antes de gravar
async function hashPasswords(fields, data) {
  for (const field of fields.filter((item) => item.type === 'password')) {
    if (data[field.name] !== null) {
      data[field.name] = await bcrypt.hash(data[field.name], HASH_ROUNDS);
    }
  }
}

// Cria o controller de um cadastro a partir da sua definição e do seu repositório
export function createController({ fields }, repository) {
  return {
    // Lista todos os registros
    async list(req, res) {
      const records = await repository.findAll();
      res.json(records);
    },

    // Busca um registro pelo id da URL
    async getById(req, res) {
      const id = Number(req.params.id);
      if (!isValidId(id)) {
        return res.status(400).json({ message: 'Id inválido' });
      }

      const record = await repository.findById(id);
      if (!record) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }

      res.json(record);
    },

    // Valida o corpo da requisição, protege a senha e cria o registro
    async create(req, res) {
      const body = req.body ?? {};

      const error = validateFields(fields, body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const data = extractData(fields, body);
      await hashPasswords(fields, data);

      const record = await repository.create(data);
      res.status(201).json(record);
    },

    // Atualiza o registro, e para inativar basta enviar status false
    async update(req, res) {
      const id = Number(req.params.id);
      const body = req.body ?? {};

      if (!isValidId(id)) {
        return res.status(400).json({ message: 'Id inválido' });
      }

      const error = validateFields(fields, body, { isUpdate: true });
      if (error) {
        return res.status(400).json({ message: error });
      }
      if (typeof body.status !== 'boolean') {
        return res.status(400).json({ message: 'Campo status é obrigatório' });
      }

      const data = extractData(fields, body);
      await hashPasswords(fields, data);

      const record = await repository.update(id, data, body.status);
      if (!record) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }

      res.json(record);
    },
  };
}
