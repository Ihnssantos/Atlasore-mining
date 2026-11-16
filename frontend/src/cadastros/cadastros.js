// Definição de cada cadastro exibido na tela: rota da API, textos e campos do formulário
// Os campos seguem a mesma definição do backend

// Campo de texto simples
const textField = (name, label, extra = {}) => ({ name, label, type: 'text', ...extra });

const nameField = textField('nome', 'Nome');
const descriptionField = textField('descricao', 'Descrição', { required: false });

// Campo que escolhe um registro de outro cadastro, pelo caminho da API dele
const reference = (name, label, refPath) => ({ name, label, type: 'reference', refPath });

const passwordField = { name: 'senha', label: 'Senha', type: 'password' };

export const cadastros = [
  {
    path: 'usuarios',
    label: 'Usuários',
    singular: 'usuário',
    fields: [
      nameField,
      { name: 'email', label: 'E-mail', type: 'email' },
      passwordField,
      {
        name: 'nivel_acesso',
        label: 'Nível de acesso',
        type: 'select',
        options: ['usuario', 'normal', 'admin'],
      },
    ],
  },
  {
    path: 'operadores',
    label: 'Operadores',
    singular: 'operador',
    fields: [nameField, textField('matricula', 'Matrícula'), passwordField, descriptionField],
  },
  {
    path: 'turnos',
    label: 'Turnos',
    singular: 'turno',
    fields: [nameField, textField('horario', 'Horário')],
  },
  { path: 'turmas', label: 'Turmas', singular: 'turma', fields: [nameField] },
  {
    path: 'tipos-equipamento',
    label: 'Tipos de equipamento',
    singular: 'tipo de equipamento',
    fields: [nameField],
  },
  {
    path: 'grupos-equipamento',
    label: 'Grupos de equipamento',
    singular: 'grupo de equipamento',
    fields: [nameField],
  },
  {
    path: 'equipamentos',
    label: 'Equipamentos',
    singular: 'equipamento',
    fields: [
      nameField,
      reference('id_tipo_equipamento', 'Tipo', 'tipos-equipamento'),
      reference('id_grupo_equipamento', 'Grupo', 'grupos-equipamento'),
      descriptionField,
    ],
  },
  {
    path: 'materiais',
    label: 'Materiais',
    singular: 'material',
    fields: [nameField, descriptionField],
  },
  {
    path: 'cargas-medias',
    label: 'Cargas médias',
    singular: 'carga média',
    fields: [
      nameField,
      reference('id_material', 'Material', 'materiais'),
      { name: 'valor', label: 'Valor (t)', type: 'number', step: '0.01' },
    ],
  },
  {
    path: 'teores',
    label: 'Teores',
    singular: 'teor',
    fields: [
      nameField,
      reference('id_material', 'Material', 'materiais'),
      { name: 'valor', label: 'Valor', type: 'number', step: '0.0001' },
    ],
  },
  {
    path: 'tipos-codigo',
    label: 'Tipos de código',
    singular: 'tipo de código',
    fields: [nameField],
  },
  {
    path: 'grupos-codigo',
    label: 'Grupos de código',
    singular: 'grupo de código',
    fields: [nameField],
  },
  {
    path: 'codigos',
    label: 'Códigos',
    singular: 'código',
    fields: [
      nameField,
      reference('id_tipo_codigo', 'Tipo', 'tipos-codigo'),
      reference('id_grupo_codigo', 'Grupo', 'grupos-codigo'),
      descriptionField,
    ],
  },
  {
    path: 'areas',
    label: 'Áreas',
    singular: 'área',
    fields: [nameField, descriptionField],
  },
];
