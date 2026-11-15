-- AtlasOre Mining - views da gestão operacional
-- Cada view junta a tabela de dados brutos com os cadastros e devolve ids e nomes
-- A leitura do sistema passa pelas views, e a correção e a exclusão são feitas direto nas tabelas
-- CREATE OR ALTER permite rodar o script várias vezes, atualizando a view se ela já existir

USE AtlasOre;
GO

-- Ciclos de transporte, com a produção do ciclo (carga média em toneladas)
CREATE OR ALTER VIEW dbo.vw_ciclos_transporte AS
SELECT
    c.id,
    c.hora_inicio,
    c.hora_fim,
    c.duracao_segundos,
    c.id_equipamento,
    e.nome  AS equipamento,
    c.id_grupo_equipamento,
    ge.nome AS grupo_equipamento,
    c.id_operador,
    o.nome  AS operador,
    c.id_turno,
    t.nome  AS turno,
    c.id_turma,
    tm.nome AS turma,
    c.id_area_origem,
    ao.nome AS area_origem,
    c.id_area_destino,
    ad.nome AS area_destino,
    c.id_material,
    m.nome  AS material,
    c.id_carga_media,
    cm.valor AS producao,
    c.criado_em,
    c.atualizado_em,
    c.atualizado_por
FROM dbo.ciclos_transporte c
JOIN dbo.equipamentos e         ON e.id  = c.id_equipamento
JOIN dbo.grupos_equipamento ge  ON ge.id = c.id_grupo_equipamento
JOIN dbo.operadores o           ON o.id  = c.id_operador
JOIN dbo.turnos t               ON t.id  = c.id_turno
JOIN dbo.turmas tm              ON tm.id = c.id_turma
JOIN dbo.areas ao               ON ao.id = c.id_area_origem
JOIN dbo.areas ad               ON ad.id = c.id_area_destino
JOIN dbo.materiais m            ON m.id  = c.id_material
JOIN dbo.cargas_medias cm       ON cm.id = c.id_carga_media;
GO

-- Códigos apontados, com o tipo e o grupo do equipamento e do código
CREATE OR ALTER VIEW dbo.vw_apontamentos_codigos AS
SELECT
    a.id,
    a.hora_inicio,
    a.hora_fim,
    a.duracao_segundos,
    a.id_tipo_equipamento,
    te.nome AS tipo_equipamento,
    a.id_equipamento,
    e.nome  AS equipamento,
    a.id_grupo_equipamento,
    ge.nome AS grupo_equipamento,
    a.id_tipo_codigo,
    tc.nome AS tipo_codigo,
    a.id_codigo,
    cd.nome AS codigo,
    a.id_grupo_codigo,
    gc.nome AS grupo_codigo,
    a.id_operador,
    o.nome  AS operador,
    a.id_turno,
    t.nome  AS turno,
    a.id_turma,
    tm.nome AS turma,
    a.id_area,
    ar.nome AS area,
    a.criado_em,
    a.atualizado_em,
    a.atualizado_por
FROM dbo.apontamentos_codigos a
JOIN dbo.tipos_equipamento te   ON te.id = a.id_tipo_equipamento
JOIN dbo.equipamentos e         ON e.id  = a.id_equipamento
JOIN dbo.grupos_equipamento ge  ON ge.id = a.id_grupo_equipamento
JOIN dbo.tipos_codigo tc        ON tc.id = a.id_tipo_codigo
JOIN dbo.codigos cd             ON cd.id = a.id_codigo
JOIN dbo.grupos_codigo gc       ON gc.id = a.id_grupo_codigo
JOIN dbo.operadores o           ON o.id  = a.id_operador
JOIN dbo.turnos t               ON t.id  = a.id_turno
JOIN dbo.turmas tm              ON tm.id = a.id_turma
JOIN dbo.areas ar               ON ar.id = a.id_area;
GO

-- Horímetros
CREATE OR ALTER VIEW dbo.vw_registros_horimetro AS
SELECT
    l.id,
    l.hora,
    l.id_tipo_equipamento,
    te.nome AS tipo_equipamento,
    l.id_equipamento,
    e.nome  AS equipamento,
    l.id_grupo_equipamento,
    ge.nome AS grupo_equipamento,
    l.id_operador,
    o.nome  AS operador,
    l.id_turno,
    t.nome  AS turno,
    l.id_turma,
    tm.nome AS turma,
    l.id_area,
    ar.nome AS area,
    l.horimetro,
    l.criado_em,
    l.atualizado_em,
    l.atualizado_por
FROM dbo.registros_horimetro l
JOIN dbo.tipos_equipamento te   ON te.id = l.id_tipo_equipamento
JOIN dbo.equipamentos e         ON e.id  = l.id_equipamento
JOIN dbo.grupos_equipamento ge  ON ge.id = l.id_grupo_equipamento
JOIN dbo.operadores o           ON o.id  = l.id_operador
JOIN dbo.turnos t               ON t.id  = l.id_turno
JOIN dbo.turmas tm              ON tm.id = l.id_turma
JOIN dbo.areas ar               ON ar.id = l.id_area;
GO

-- Abastecimentos
CREATE OR ALTER VIEW dbo.vw_registros_abastecimento AS
SELECT
    r.id,
    r.hora_inicio,
    r.hora_fim,
    r.duracao_segundos,
    r.id_equipamento_abastecido,
    ea.nome AS equipamento_abastecido,
    r.id_comboio,
    ec.nome AS comboio,
    r.id_operador_equipamento,
    oe.nome AS operador_equipamento,
    r.id_operador_comboio,
    oc.nome AS operador_comboio,
    r.id_turno,
    t.nome  AS turno,
    r.id_turma,
    tm.nome AS turma,
    r.id_area,
    ar.nome AS area,
    r.tanque_inicial,
    r.tanque_final,
    r.criado_em,
    r.atualizado_em,
    r.atualizado_por
FROM dbo.registros_abastecimento r
JOIN dbo.equipamentos ea  ON ea.id = r.id_equipamento_abastecido
JOIN dbo.equipamentos ec  ON ec.id = r.id_comboio
JOIN dbo.operadores oe    ON oe.id = r.id_operador_equipamento
JOIN dbo.operadores oc    ON oc.id = r.id_operador_comboio
JOIN dbo.turnos t         ON t.id  = r.id_turno
JOIN dbo.turmas tm        ON tm.id = r.id_turma
JOIN dbo.areas ar         ON ar.id = r.id_area;
GO
