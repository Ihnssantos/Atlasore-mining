// Definição de cada registro da gestão operacional
// table: tabela onde se grava | view: de onde se lê | periodColumn e endColumn: início e fim do registro
// fields: campos enviados pelo cliente | derived: campos que a API preenche a partir de outro cadastro
// filters: colunas da view que podem ser usadas como filtro na listagem

// Campo de data e hora
const datetimeField = (name) => ({ name, type: 'datetime' });

// Campo que guarda o id de um cadastro
const foreignKey = (name) => ({ name, type: 'int' });

// Regra que busca um valor em outro cadastro, pelo id informado em from
const derivedFrom = (field, from, table, column) => ({ field, from, table, column });

export const registros = [
  {
    path: 'ciclos-transporte',
    table: 'ciclos_transporte',
    view: 'vw_ciclos_transporte',
    periodColumn: 'hora_inicio',
    endColumn: 'hora_fim',
    fields: [
      datetimeField('hora_inicio'),
      datetimeField('hora_fim'),
      foreignKey('id_equipamento'),
      foreignKey('id_operador'),
      foreignKey('id_turno'),
      foreignKey('id_turma'),
      foreignKey('id_area_origem'),
      foreignKey('id_area_destino'),
      foreignKey('id_carga_media'),
    ],
    derived: [
      derivedFrom('id_grupo_equipamento', 'id_equipamento', 'equipamentos', 'id_grupo_equipamento'),
      derivedFrom('id_material', 'id_carga_media', 'cargas_medias', 'id_material'),
    ],
    filters: [
      'id_equipamento',
      'id_grupo_equipamento',
      'id_operador',
      'id_turno',
      'id_turma',
      'id_area_origem',
      'id_area_destino',
      'id_material',
    ],
  },
  {
    path: 'apontamentos-codigos',
    table: 'apontamentos_codigos',
    view: 'vw_apontamentos_codigos',
    periodColumn: 'hora_inicio',
    endColumn: 'hora_fim',
    fields: [
      datetimeField('hora_inicio'),
      datetimeField('hora_fim'),
      foreignKey('id_equipamento'),
      foreignKey('id_codigo'),
      foreignKey('id_operador'),
      foreignKey('id_turno'),
      foreignKey('id_turma'),
      foreignKey('id_area'),
    ],
    derived: [
      derivedFrom('id_tipo_equipamento', 'id_equipamento', 'equipamentos', 'id_tipo_equipamento'),
      derivedFrom('id_grupo_equipamento', 'id_equipamento', 'equipamentos', 'id_grupo_equipamento'),
      derivedFrom('id_tipo_codigo', 'id_codigo', 'codigos', 'id_tipo_codigo'),
      derivedFrom('id_grupo_codigo', 'id_codigo', 'codigos', 'id_grupo_codigo'),
    ],
    filters: [
      'id_tipo_equipamento',
      'id_equipamento',
      'id_grupo_equipamento',
      'id_tipo_codigo',
      'id_codigo',
      'id_grupo_codigo',
      'id_operador',
      'id_turno',
      'id_turma',
      'id_area',
    ],
  },
  {
    path: 'registros-horimetro',
    table: 'registros_horimetro',
    view: 'vw_registros_horimetro',
    periodColumn: 'hora',
    fields: [
      datetimeField('hora'),
      foreignKey('id_equipamento'),
      foreignKey('id_operador'),
      foreignKey('id_turno'),
      foreignKey('id_turma'),
      foreignKey('id_area'),
      { name: 'horimetro', type: 'decimal', precision: 10, scale: 1 },
    ],
    derived: [
      derivedFrom('id_tipo_equipamento', 'id_equipamento', 'equipamentos', 'id_tipo_equipamento'),
      derivedFrom('id_grupo_equipamento', 'id_equipamento', 'equipamentos', 'id_grupo_equipamento'),
    ],
    filters: [
      'id_tipo_equipamento',
      'id_equipamento',
      'id_grupo_equipamento',
      'id_operador',
      'id_turno',
      'id_turma',
      'id_area',
    ],
  },
  {
    path: 'registros-abastecimento',
    table: 'registros_abastecimento',
    view: 'vw_registros_abastecimento',
    periodColumn: 'hora_inicio',
    endColumn: 'hora_fim',
    fields: [
      datetimeField('hora_inicio'),
      datetimeField('hora_fim'),
      foreignKey('id_equipamento_abastecido'),
      foreignKey('id_comboio'),
      foreignKey('id_operador_equipamento'),
      foreignKey('id_operador_comboio'),
      foreignKey('id_turno'),
      foreignKey('id_turma'),
      foreignKey('id_area'),
      { name: 'tanque_inicial', type: 'decimal', precision: 10, scale: 2 },
      { name: 'tanque_final', type: 'decimal', precision: 10, scale: 2 },
    ],
    derived: [],
    filters: [
      'id_equipamento_abastecido',
      'id_comboio',
      'id_operador_equipamento',
      'id_operador_comboio',
      'id_turno',
      'id_turma',
      'id_area',
    ],
  },
];
