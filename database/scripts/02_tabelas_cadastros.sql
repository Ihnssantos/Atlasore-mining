-- =====================================================================
-- AtlasOre Mining - tabelas de cadastros
-- Convenções: snake_case, plural, id INT IDENTITY, status BIT (1 = ativo)
-- Idempotente: pode rodar várias vezes sem recriar o que já existe.
-- =====================================================================

USE AtlasOre;
GO

--USUARIOS----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
CREATE TABLE dbo.usuarios (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_usuarios PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL CONSTRAINT UQ_usuarios_email UNIQUE,
    senha_hash NVARCHAR(255) NOT NULL,
    nivel_acesso NVARCHAR(10)  NOT NULL
    CONSTRAINT CK_usuarios_nivel_acesso CHECK (nivel_acesso IN (N'usuario', N'normal', N'admin')),
    status BIT NOT NULL CONSTRAINT DF_usuarios_status DEFAULT 1
);
GO

--OPERADORES----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.operadores', N'U') IS NULL
CREATE TABLE dbo.operadores (
    id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_operadores PRIMARY KEY,
    nome        NVARCHAR(100) NOT NULL,
    matricula   NVARCHAR(20)  NOT NULL CONSTRAINT UQ_operadores_matricula UNIQUE,
    descricao   NVARCHAR(255) NULL,
    senha_hash  NVARCHAR(255) NOT NULL,
    status      BIT           NOT NULL CONSTRAINT DF_operadores_status DEFAULT 1
);
GO

--TURNOS----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.turnos', N'U') IS NULL
CREATE TABLE dbo.turnos (
    id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_turnos PRIMARY KEY,
    nome         NVARCHAR(50) NOT NULL CONSTRAINT UQ_turnos_nome UNIQUE,
    horario  NVARCHAR(20) NOT NULL,
    status       BIT          NOT NULL CONSTRAINT DF_turnos_status DEFAULT 1
);
GO

--TURMAS----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.turmas', N'U') IS NULL
CREATE TABLE dbo.turmas (
    id      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_turmas PRIMARY KEY,
    nome    NVARCHAR(50) NOT NULL CONSTRAINT UQ_turmas_nome UNIQUE,
    status  BIT          NOT NULL CONSTRAINT DF_turmas_status DEFAULT 1
);
GO


--TIPO EQUIPAMENTO----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.tipos_equipamento', N'U') IS NULL
CREATE TABLE dbo.tipos_equipamento (
    id      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_tipos_equipamento PRIMARY KEY,
    nome    NVARCHAR(50) NOT NULL CONSTRAINT UQ_tipos_equipamento_nome UNIQUE,
    status  BIT          NOT NULL CONSTRAINT DF_tipos_equipamento_status DEFAULT 1
);
GO

--GRUPO EQUIPAMENTO----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.grupos_equipamento', N'U') IS NULL
CREATE TABLE dbo.grupos_equipamento (
    id      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_grupos_equipamento PRIMARY KEY,
    nome    NVARCHAR(50) NOT NULL CONSTRAINT UQ_grupos_equipamento_nome UNIQUE,
    status  BIT          NOT NULL CONSTRAINT DF_grupos_equipamento_status DEFAULT 1
);
GO

--EQUIPAMENTO----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.equipamentos', N'U') IS NULL
CREATE TABLE dbo.equipamentos (
    id                    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_equipamentos PRIMARY KEY,
    nome                  NVARCHAR(50) NOT NULL,
    id_tipo_equipamento   INT NOT NULL CONSTRAINT FK_equipamentos_tipo  REFERENCES dbo.tipos_equipamento (id),
    id_grupo_equipamento  INT NOT NULL CONSTRAINT FK_equipamentos_grupo REFERENCES dbo.grupos_equipamento (id),
    descricao             NVARCHAR(255) NULL,
    status                BIT NOT NULL CONSTRAINT DF_equipamentos_status DEFAULT 1
);
GO

-- Nome único só entre ativos: permite inativar o equipamento e criar outro com o mesmo nome em outra frota
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_equipamentos_nome_ativo' AND object_id = OBJECT_ID(N'dbo.equipamentos'))
CREATE UNIQUE INDEX UX_equipamentos_nome_ativo ON dbo.equipamentos (nome) WHERE status = 1;
GO

--MATERIAIS----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.materiais', N'U') IS NULL
CREATE TABLE dbo.materiais (
    id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_materiais PRIMARY KEY,
    nome              NVARCHAR(50) NOT NULL CONSTRAINT UQ_materiais_nome UNIQUE,
    descricao         NVARCHAR(255) NULL,
    status            BIT          NOT NULL CONSTRAINT DF_materiais_status DEFAULT 1
);
GO

--CARGAS MEDIA----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.cargas_medias', N'U') IS NULL
CREATE TABLE dbo.cargas_medias (
    id                    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_cargas_medias PRIMARY KEY,
    nome                  NVARCHAR(50)  NOT NULL,
    id_material           INT           NOT NULL CONSTRAINT FK_materiais_cargas REFERENCES materiais (id),
    valor                 DECIMAL(10,2) NOT NULL,
    status                BIT           NOT NULL CONSTRAINT DF_cargas_medias_status DEFAULT 1
);
GO

--TEORES----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.teores', N'U') IS NULL
CREATE TABLE dbo.teores (
    id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_teores PRIMARY KEY,
    nome         NVARCHAR(50)  NOT NULL,
    id_material  INT           NOT NULL CONSTRAINT FK_teores_material REFERENCES dbo.materiais (id),
    valor        DECIMAL(10,4) NOT NULL,
    status       BIT           NOT NULL CONSTRAINT DF_teores_status DEFAULT 1
);
GO

--TIPO CODIGO----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.tipos_codigo', N'U') IS NULL
CREATE TABLE dbo.tipos_codigo (
    id      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_tipos_codigo PRIMARY KEY,
    nome    NVARCHAR(50) NOT NULL CONSTRAINT UQ_tipos_codigo_nome UNIQUE,
    status  BIT          NOT NULL CONSTRAINT DF_tipos_codigo_status DEFAULT 1
);
GO

--GRUPO CODIGO----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.grupos_codigo', N'U') IS NULL
CREATE TABLE dbo.grupos_codigo (
    id      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_grupos_codigo PRIMARY KEY,
    nome    NVARCHAR(50) NOT NULL CONSTRAINT UQ_grupos_codigo_nome UNIQUE,
    status  BIT          NOT NULL CONSTRAINT DF_grupos_codigo_status DEFAULT 1
);
GO

--CODIGOS----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.codigos', N'U') IS NULL
CREATE TABLE dbo.codigos (
    id               INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_codigos PRIMARY KEY,
    nome             NVARCHAR(100) NOT NULL CONSTRAINT UQ_codigos_nome UNIQUE,
    id_tipo_codigo   INT           NOT NULL CONSTRAINT FK_codigos_tipo  REFERENCES dbo.tipos_codigo (id),
    id_grupo_codigo  INT           NOT NULL CONSTRAINT FK_codigos_grupo REFERENCES dbo.grupos_codigo (id),
    descricao        NVARCHAR(255) NULL,
    status           BIT           NOT NULL CONSTRAINT DF_codigos_status DEFAULT 1
);
GO

--AREAS----------------------------------------------------------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.areas', N'U') IS NULL
CREATE TABLE dbo.areas (
    id         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_areas PRIMARY KEY,
    nome       NVARCHAR(50)  NOT NULL CONSTRAINT UQ_areas_nome UNIQUE,
    descricao  NVARCHAR(255) NULL,
    status     BIT           NOT NULL CONSTRAINT DF_areas_status DEFAULT 1
);
GO