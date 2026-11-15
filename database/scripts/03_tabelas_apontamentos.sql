
USE AtlasOre;
GO

-- Necessário para criar colunas calculadas persistidas
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- Viagens dos caminhões: cada linha é um ciclo de carga, transporte e basculamento
IF OBJECT_ID(N'dbo.ciclos_transporte', N'U') IS NULL
CREATE TABLE dbo.ciclos_transporte (
    id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ciclos_transporte PRIMARY KEY,
    hora_inicio       DATETIME2(0) NOT NULL,
    hora_fim          DATETIME2(0) NOT NULL,
    duracao_segundos  AS DATEDIFF(SECOND, hora_inicio, hora_fim) PERSISTED,
    id_equipamento    INT NOT NULL CONSTRAINT FK_ciclos_transporte_equipamento REFERENCES dbo.equipamentos (id),
    id_grupo_equipamento    INT NOT NULL CONSTRAINT FK_ciclos_transporte_grupo_equipamento REFERENCES dbo.grupos_equipamento (id),
    id_operador       INT NOT NULL CONSTRAINT FK_ciclos_transporte_operador REFERENCES dbo.operadores (id),
    id_turno          INT NOT NULL CONSTRAINT FK_ciclos_transporte_turno REFERENCES dbo.turnos (id),
    id_turma          INT NOT NULL CONSTRAINT FK_ciclos_transporte_turma REFERENCES dbo.turmas (id),
    id_area_origem    INT NOT NULL CONSTRAINT FK_ciclos_transporte_origem REFERENCES dbo.areas (id),
    id_area_destino   INT NOT NULL CONSTRAINT FK_ciclos_transporte_destino REFERENCES dbo.areas (id),
    id_material       INT NOT NULL CONSTRAINT FK_ciclos_transporte_material REFERENCES dbo.materiais (id),
    id_carga_media    INT NOT NULL CONSTRAINT FK_ciclos_transporte_carga_media REFERENCES dbo.cargas_medias (id),
    criado_em         DATETIME2(0) NOT NULL CONSTRAINT DF_ciclos_transporte_criado_em DEFAULT SYSDATETIME(),
    atualizado_em     DATETIME2(0) NULL,
    atualizado_por    INT NULL CONSTRAINT FK_ciclos_transporte_atualizado_por REFERENCES dbo.usuarios (id),
    CONSTRAINT CK_ciclos_transporte_periodo CHECK (hora_fim >= hora_inicio)
);
GO

-- Códigos apontados pelos operadores: paradas, checklist, manutenção e outros
IF OBJECT_ID(N'dbo.apontamentos_codigos', N'U') IS NULL
CREATE TABLE dbo.apontamentos_codigos (
    id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_apontamentos_codigos PRIMARY KEY,
    hora_inicio       DATETIME2(0) NOT NULL,
    hora_fim          DATETIME2(0) NOT NULL,
    duracao_segundos  AS DATEDIFF(SECOND, hora_inicio, hora_fim) PERSISTED,
    id_tipo_equipamento INT NOT NULL CONSTRAINT FK_apontamentos_codigos_tipo_equipamento REFERENCES dbo.tipos_equipamento (id),
    id_equipamento    INT NOT NULL CONSTRAINT FK_apontamentos_codigos_equipamento REFERENCES dbo.equipamentos (id),
    id_grupo_equipamento INT NOT NULL CONSTRAINT FK_apontamentos_codigos_grupo_equipamento REFERENCES dbo.grupos_equipamento (id),
    id_tipo_codigo      INT NOT NULL CONSTRAINT FK_apontamentos_codigos_tipo_codigo REFERENCES dbo.tipos_codigo (id),
    id_codigo         INT NOT NULL CONSTRAINT FK_apontamentos_codigos_codigo REFERENCES dbo.codigos (id),
    id_grupo_codigo     INT NOT NULL CONSTRAINT FK_apontamentos_codigos_grupo_codigo REFERENCES dbo.grupos_codigo (id),
    id_operador       INT NOT NULL CONSTRAINT FK_apontamentos_codigos_operador REFERENCES dbo.operadores (id),
    id_turno          INT NOT NULL CONSTRAINT FK_apontamentos_codigos_turno REFERENCES dbo.turnos (id),
    id_turma          INT NOT NULL CONSTRAINT FK_apontamentos_codigos_turma REFERENCES dbo.turmas (id),
    id_area           INT NOT NULL CONSTRAINT FK_apontamentos_codigos_area REFERENCES dbo.areas (id),
    criado_em         DATETIME2(0) NOT NULL CONSTRAINT DF_apontamentos_codigos_criado_em DEFAULT SYSDATETIME(),
    atualizado_em     DATETIME2(0) NULL,
    atualizado_por    INT NULL CONSTRAINT FK_apontamentos_codigos_atualizado_por REFERENCES dbo.usuarios (id),
    CONSTRAINT CK_apontamentos_codigos_periodo CHECK (hora_fim >= hora_inicio)
);
GO

-- Cada apontamento de horímetro
IF OBJECT_ID(N'dbo.registros_horimetro', N'U') IS NULL
CREATE TABLE dbo.registros_horimetro (
    id                 INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_registros_horimetro PRIMARY KEY,
    hora               DATETIME2(0) NOT NULL,
    id_tipo_equipamento INT NOT NULL CONSTRAINT FK_registros_horimetro_tipo_equipamento REFERENCES dbo.tipos_equipamento (id),
    id_equipamento     INT NOT NULL CONSTRAINT FK_registros_horimetro_equipamento REFERENCES dbo.equipamentos (id),
    id_grupo_equipamento INT NOT NULL CONSTRAINT FK_registros_horimetro_grupo_equipamento REFERENCES dbo.grupos_equipamento (id),
    id_operador        INT NOT NULL CONSTRAINT FK_registros_horimetro_operador REFERENCES dbo.operadores (id),
    id_turno           INT NOT NULL CONSTRAINT FK_registros_horimetro_turno REFERENCES dbo.turnos (id),
    id_turma           INT NOT NULL CONSTRAINT FK_registros_horimetro_turma REFERENCES dbo.turmas (id),
    id_area            INT NOT NULL CONSTRAINT FK_registros_horimetro_area REFERENCES dbo.areas (id),
    horimetro          DECIMAL(10,1) NOT NULL,
    criado_em          DATETIME2(0) NOT NULL CONSTRAINT DF_registros_horimetro_criado_em DEFAULT SYSDATETIME(),
    atualizado_em      DATETIME2(0) NULL,
    atualizado_por     INT NULL CONSTRAINT FK_registros_horimetro_atualizado_por REFERENCES dbo.usuarios (id)
);
GO

-- Abastecimentos: o comboio abastece outro equipamento, e os tanques são medidos em litros
IF OBJECT_ID(N'dbo.registros_abastecimento', N'U') IS NULL
CREATE TABLE dbo.registros_abastecimento (
    id                         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_registros_abastecimento PRIMARY KEY,
    hora_inicio                DATETIME2(0) NOT NULL,
    hora_fim                   DATETIME2(0) NOT NULL,
    duracao_segundos           AS DATEDIFF(SECOND, hora_inicio, hora_fim) PERSISTED,
    id_equipamento_abastecido  INT NOT NULL CONSTRAINT FK_registros_abastecimento_abastecido REFERENCES dbo.equipamentos (id),
    id_comboio                 INT NOT NULL CONSTRAINT FK_registros_abastecimento_comboio REFERENCES dbo.equipamentos (id),
    id_operador_equipamento    INT NOT NULL CONSTRAINT FK_registros_abastecimento_operador_equip REFERENCES dbo.operadores (id),
    id_operador_comboio        INT NOT NULL CONSTRAINT FK_registros_abastecimento_operador_comboio REFERENCES dbo.operadores (id),
    id_turno                   INT NOT NULL CONSTRAINT FK_registros_abastecimento_turno REFERENCES dbo.turnos (id),
    id_turma                   INT NOT NULL CONSTRAINT FK_registros_abastecimento_turma REFERENCES dbo.turmas (id),
    id_area                    INT NOT NULL CONSTRAINT FK_registros_abastecimento_area REFERENCES dbo.areas (id),
    tanque_inicial             DECIMAL(10,2) NOT NULL,
    tanque_final               DECIMAL(10,2) NOT NULL,
    criado_em                  DATETIME2(0) NOT NULL CONSTRAINT DF_registros_abastecimento_criado_em DEFAULT SYSDATETIME(),
    atualizado_em              DATETIME2(0) NULL,
    atualizado_por             INT NULL CONSTRAINT FK_registros_abastecimento_atualizado_por REFERENCES dbo.usuarios (id),
    CONSTRAINT CK_registros_abastecimento_periodo CHECK (hora_fim >= hora_inicio),
    CONSTRAINT CK_registros_abastecimento_tanque CHECK (tanque_final >= tanque_inicial)
);
GO