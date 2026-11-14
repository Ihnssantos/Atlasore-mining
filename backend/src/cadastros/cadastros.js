// Definição de cada cadastro: rota, tabela e campos aceitos
// Os campos id e status existem em todas as tabelas e são tratados pelo molde

// Campo de nome com o tamanho máximo da coluna
const nameField = (max) => ({ name: 'nome', type: 'string', max });

// Campo de descrição, opcional em todas as tabelas que o possuem
const descriptionField = { name: 'descricao', type: 'string', max: 255, required: false };

// Campo que guarda o id de outro cadastro
const foreignKey = (name) => ({ name, type: 'int' });

// A API recebe a senha em texto e grava somente o hash na coluna senha_hash
const passwordField = { name: 'senha', column: 'senha_hash', type: 'password' };

export const cadastros = [
  {
    path: 'usuarios',
    table: 'usuarios',
    fields: [
      nameField(100),
      { name: 'email', type: 'email', max: 150 },
      passwordField,
      { name: 'nivel_acesso', type: 'enum', max: 10, values: ['usuario', 'normal', 'admin'] },
    ],
  },
  {
    path: 'operadores',
    table: 'operadores',
    fields: [
      nameField(100),
      { name: 'matricula', type: 'string', max: 20 },
      passwordField,
      descriptionField,
    ],
  },
  {
    path: 'turnos',
    table: 'turnos',
    fields: [nameField(50), { name: 'horario', type: 'string', max: 20 }],
  },
  { path: 'turmas', table: 'turmas', fields: [nameField(50)] },
  { path: 'tipos-equipamento', table: 'tipos_equipamento', fields: [nameField(50)] },
  { path: 'grupos-equipamento', table: 'grupos_equipamento', fields: [nameField(50)] },
  {
    path: 'equipamentos',
    table: 'equipamentos',
    fields: [
      nameField(50),
      foreignKey('id_tipo_equipamento'),
      foreignKey('id_grupo_equipamento'),
      descriptionField,
    ],
  },
  { path: 'materiais', table: 'materiais', fields: [nameField(50), descriptionField] },
  {
    path: 'cargas-medias',
    table: 'cargas_medias',
    fields: [
      nameField(50),
      foreignKey('id_material'),
      { name: 'valor', type: 'decimal', precision: 10, scale: 2 },
    ],
  },
  {
    path: 'teores',
    table: 'teores',
    fields: [
      nameField(50),
      foreignKey('id_material'),
      { name: 'valor', type: 'decimal', precision: 10, scale: 4 },
    ],
  },
  { path: 'tipos-codigo', table: 'tipos_codigo', fields: [nameField(50)] },
  { path: 'grupos-codigo', table: 'grupos_codigo', fields: [nameField(50)] },
  {
    path: 'codigos',
    table: 'codigos',
    fields: [
      nameField(100),
      foreignKey('id_tipo_codigo'),
      foreignKey('id_grupo_codigo'),
      descriptionField,
    ],
  },
  { path: 'areas', table: 'areas', fields: [nameField(50), descriptionField] },
];
