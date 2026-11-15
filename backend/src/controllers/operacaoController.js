import { extractData, validateFields } from '../cadastros/fields.js';

// Confere se o id da URL é um número inteiro positivo
function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

// Converte um texto em data, ou retorna null se não for uma data válida
function parseDate(value) {
  const date = new Date(value);
  return typeof value === 'string' && !Number.isNaN(date.getTime()) ? date : null;
}

// Lê da URL os filtros permitidos e retorna null se algum não for um id válido
function parseFilters(query, allowedFilters) {
  const values = {};

  for (const name of allowedFilters) {
    if (query[name] === undefined) {
      continue;
    }

    const id = Number(query[name]);
    if (!isValidId(id)) {
      return null;
    }
    values[name] = id;
  }

  return values;
}

// Cria o controller de um registro da gestão operacional a partir da sua definição e do seu repositório
export function createOperacaoController(resource, repository) {
  const { fields, filters, periodColumn, endColumn } = resource;

  // Confere se a hora fim não é anterior à hora início, quando os dois estão no objeto
  function isEndBeforeStart(data) {
    if (!endColumn || !data[periodColumn] || !data[endColumn]) {
      return false;
    }
    return data[endColumn] < data[periodColumn];
  }

  return {
    // Lista os registros do período (de e ate são obrigatórios) com os filtros da URL
    async list(req, res) {
      const from = parseDate(req.query.de);
      const to = parseDate(req.query.ate);
      if (!from || !to) {
        return res.status(400).json({ message: 'Informe o período com de e ate, em formato de data e hora' });
      }

      const filterValues = parseFilters(req.query, filters);
      if (!filterValues) {
        return res.status(400).json({ message: 'Filtro inválido' });
      }

      const records = await repository.findByPeriod(from, to, filterValues);
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

    // Valida o corpo da requisição e cria o registro
    async create(req, res) {
      const body = req.body ?? {};

      const error = validateFields(fields, body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const data = extractData(fields, body);
      if (isEndBeforeStart(data)) {
        return res.status(400).json({ message: 'A hora fim não pode ser anterior à hora início' });
      }

      const record = await repository.create(data);
      res.status(201).json(record);
    },

    // Edita só os campos enviados, o que permite corrigir uma coluna de cada vez
    async update(req, res) {
      const id = Number(req.params.id);
      const body = req.body ?? {};

      if (!isValidId(id)) {
        return res.status(400).json({ message: 'Id inválido' });
      }
      if (!fields.some((field) => body[field.name] !== undefined)) {
        return res.status(400).json({ message: 'Nenhum campo informado' });
      }

      const error = validateFields(fields, body, { isPartial: true });
      if (error) {
        return res.status(400).json({ message: error });
      }

      const data = extractData(fields, body, { onlyProvided: true });
      if (isEndBeforeStart(data)) {
        return res.status(400).json({ message: 'A hora fim não pode ser anterior à hora início' });
      }

      // req.user existe quando o login estiver ativo, e identifica quem corrigiu o registro
      const record = await repository.update(id, data, req.user?.id);
      if (!record) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }

      res.json(record);
    },

    // Apaga a linha inteira
    async remove(req, res) {
      const id = Number(req.params.id);
      if (!isValidId(id)) {
        return res.status(400).json({ message: 'Id inválido' });
      }

      const wasRemoved = await repository.remove(id);
      if (!wasRemoved) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }

      res.status(204).end();
    },
  };
}
