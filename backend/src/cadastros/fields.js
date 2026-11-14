// Regras de validação e preparo dos campos de um cadastro

// Formato mínimo de um e-mail: texto, arroba, domínio e ponto
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tamanho mínimo da senha em texto
const PASSWORD_MIN_LENGTH = 6;

// Valores ausentes, nulos ou só com espaços contam como vazios
function isEmpty(value) {
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  return value === undefined || value === null;
}

// Todo campo é obrigatório, a menos que a definição diga o contrário
function isRequired(field) {
  return field.required !== false;
}

// Valida um valor já enviado de acordo com o tipo do campo e retorna a mensagem de erro ou null
function validateValue(field, value) {
  const invalid = `Campo ${field.name} inválido`;

  switch (field.type) {
    case 'int':
      return Number.isInteger(value) && value > 0 ? null : invalid;
    case 'decimal':
      return Number.isFinite(value) ? null : invalid;
    case 'enum':
      return field.values.includes(value) ? null : invalid;
    case 'email': {
      const isValid =
        typeof value === 'string' &&
        value.trim().length <= field.max &&
        EMAIL_PATTERN.test(value.trim());
      return isValid ? null : invalid;
    }
    case 'password':
      return typeof value === 'string' && value.length >= PASSWORD_MIN_LENGTH ? null : invalid;
    default:
      return typeof value === 'string' && value.trim().length <= field.max ? null : invalid;
  }
}

// Valida todos os campos e retorna a primeira mensagem de erro ou null
// Na atualização a senha é opcional, e quando não vem a senha atual é mantida
export function validateFields(fields, body, { isUpdate = false } = {}) {
  for (const field of fields) {
    const value = body[field.name];
    const isOptionalPassword = isUpdate && field.type === 'password';

    if (isEmpty(value)) {
      if (isRequired(field) && !isOptionalPassword) {
        return `Campo ${field.name} é obrigatório`;
      }
      continue;
    }

    const error = validateValue(field, value);
    if (error) {
      return error;
    }
  }

  return null;
}

// Monta o objeto com os valores prontos para gravar
// Textos ficam sem espaços nas pontas (exceto a senha) e campos vazios viram null
export function extractData(fields, body) {
  const data = {};

  for (const field of fields) {
    const value = body[field.name];

    if (isEmpty(value)) {
      data[field.name] = null;
    } else if (typeof value === 'string' && field.type !== 'password') {
      data[field.name] = value.trim();
    } else {
      data[field.name] = value;
    }
  }

  return data;
}
