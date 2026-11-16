// Funções de apoio para exibir e enviar os dados dos cadastros

// Tipos de campo cujo valor deve ser enviado à API como número
const NUMERIC_TYPES = ['reference', 'number'];

// Procura o nome de um registro referenciado pelo id e, se não achar, mostra o próprio id
function findReferenceName(references, refPath, id) {
  return references[refPath]?.find((item) => item.id === id)?.nome ?? id;
}

// Monta as colunas da tabela: id, campos do cadastro (menos a senha) e status
export function getColumns(cadastro, references) {
  const fieldColumns = cadastro.fields
    .filter((field) => field.type !== 'password')
    .map((field) => ({
      key: field.name,
      label: field.label,
      render: (row) =>
        field.type === 'reference'
          ? findReferenceName(references, field.refPath, row[field.name])
          : row[field.name],
    }));

  return [
    { key: 'id', label: 'ID', render: (row) => row.id },
    ...fieldColumns,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={row.status ? 'badge badge-active' : 'badge badge-inactive'}>
          {row.status ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];
}

// Valores iniciais do formulário: vazios para um novo registro ou os do registro editado
// A senha nunca vem preenchida
export function buildInitialValues(cadastro, record) {
  const values = {};

  cadastro.fields.forEach((field) => {
    values[field.name] = field.type === 'password' ? '' : (record?.[field.name] ?? '');
  });

  return values;
}

// Converte os valores do formulário no corpo da requisição
// Na edição, a senha em branco é omitida para manter a atual, e o status é enviado
export function buildPayload(cadastro, values, { isEditing, status }) {
  const payload = {};

  cadastro.fields.forEach((field) => {
    const value = values[field.name];

    if (field.type === 'password' && isEditing && value === '') {
      return;
    }
    payload[field.name] = NUMERIC_TYPES.includes(field.type) && value !== '' ? Number(value) : value;
  });

  if (isEditing) {
    payload.status = status;
  }

  return payload;
}
