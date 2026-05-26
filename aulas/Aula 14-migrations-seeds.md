# Aula 14 — Migrations e Seeds

---

## 🎯 Objetivo da Aula

Hoje vamos aprender a forma **profissional** de gerenciar mudanças no banco de dados: **Migrations** (versionamento do esquema) e **Seeds** (dados iniciais). Em vez de usar `sync({ alter: true })`, vamos ter controle total sobre cada alteração.

**O que você vai produzir hoje:**

- [x] Entender por que Migrations são essenciais em projetos profissionais
- [x] Configurar o Sequelize CLI
- [x] Criar Migrations para todas as tabelas
- [x] Criar Seeds com dados de exemplo

---

## 🤔 Por Que Migrations?

No dia a dia de uma equipe, o `sync({ alter: true })` é perigoso:

- O que acontece se dois desenvolvedores alteram o mesmo Model de formas diferentes?
- Como reverter uma mudança que deu errado?
- Como garantir que o banco de produção tem a mesma estrutura do de desenvolvimento?

**Migrations** resolvem isso: são arquivos que descrevem mudanças no banco de dados em ordem. Como commits do Git, mas para o esquema do banco.

```
Migration 001: criar tabela eventos        ✅ executada
Migration 002: criar tabela participantes   ✅ executada
Migration 003: criar tabela inscricoes      ✅ executada
Migration 004: adicionar campo "telefone"   ⏳ pendente
```

---

## 🛠️ Parte 1 — Configurando o Sequelize CLI

O Sequelize CLI é uma ferramenta de linha de comando para gerenciar Migrations e Seeds.

```bash
npm install --save-dev sequelize-cli
```

Crie o arquivo de configuração `.sequelizerc` na **raiz** do projeto:

```javascript
// .sequelizerc
const path = require("path");

module.exports = {
  config: path.resolve("src", "config", "database.json"),
  "models-path": path.resolve("src", "models"),
  "seeders-path": path.resolve("src", "database", "seeders"),
  "migrations-path": path.resolve("src", "database", "migrations"),
};
```

Crie o arquivo de configuração do banco para o CLI:

```bash
mkdir -p src/database/migrations src/database/seeders
```

```json
// src/config/database.json
{
  "development": {
    "username": "root",
    "password": "sua_senha_aqui",
    "database": "notificacoes_db",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "notificacoes_db",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql"
  }
}
```

> ⚠️ O `database.json` contém a senha em texto. Adicione ao `.gitignore` e crie um `database.json.example` sem a senha.

---

## 📋 Parte 2 — Criando as Migrations

Cada Migration tem dois métodos: `up` (aplica a mudança) e `down` (desfaz a mudança).

### Migration 1: Tabela `eventos`

```bash
npx sequelize-cli migration:generate --name criar-tabela-eventos
```

Isso cria um arquivo em `src/database/migrations/` com timestamp no nome. Abra e substitua o conteúdo:

```javascript
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("eventos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      local: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      capacidade: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("eventos");
  },
};
```

### Migration 2: Tabela `participantes`

```bash
npx sequelize-cli migration:generate --name criar-tabela-participantes
```

```javascript
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("participantes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("participantes");
  },
};
```

### Migration 3: Tabela `inscricoes` (com chaves estrangeiras)

```bash
npx sequelize-cli migration:generate --name criar-tabela-inscricoes
```

```javascript
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inscricoes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      evento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "eventos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      participante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "participantes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      data_inscricao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      status: {
        type: Sequelize.ENUM("confirmada", "cancelada"),
        allowNull: false,
        defaultValue: "confirmada",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inscricoes");
  },
};
```

> 💡 `references: { model: 'eventos', key: 'id' }` cria a **chave estrangeira** no banco. `onDelete: 'CASCADE'` significa que se deletar um evento, todas as inscrições dele são deletadas juntas.

### 🧩 Desafio — Migration 4: Tabela `notificacoes`

Agora é com vocês! Criem a migration para a tabela `notificacoes`:

```bash
npx sequelize-cli migration:generate --name criar-tabela-notificacoes
```

Campos necessários:

- `id` — INTEGER, PK, auto increment
- `inscricao_id` — INTEGER, FK para `inscricoes.id`, CASCADE
- `tipo` — ENUM('confirmacao', 'lembrete')
- `destinatario_email` — STRING, NOT NULL
- `assunto` — STRING, NOT NULL
- `conteudo` — TEXT, NOT NULL
- `data_envio` — DATE, pode ser NULL
- `enviada` — BOOLEAN, default false
- `created_at` e `updated_at`

> Sigam o padrão das migrations anteriores!

---

## 🌱 Parte 3 — Executando as Migrations

Com as migrations criadas, execute:

```bash
npx sequelize-cli db:migrate
```

Saída esperada:

```
== criar-tabela-eventos: migrating =======
== criar-tabela-eventos: migrated (0.032s)
== criar-tabela-participantes: migrating =======
...
```

Para **desfazer** a última migration:

```bash
npx sequelize-cli db:migrate:undo
```

Para desfazer **todas**:

```bash
npx sequelize-cli db:migrate:undo:all
```

> 💡 O Sequelize cria uma tabela chamada `SequelizeMeta` que guarda quais migrations já foram executadas. É assim que ele sabe quais são pendentes.

---

## 🌱 Parte 4 — Seeds (Dados Iniciais)

Seeds são dados de exemplo para desenvolvimento e testes. Crie um seed:

```bash
npx sequelize-cli seed:generate --name dados-iniciais
```

Abra o arquivo gerado e substitua:

```javascript
"use strict";

module.exports = {
  async up(queryInterface) {
    // Inserir eventos
    await queryInterface.bulkInsert("eventos", [
      {
        nome: "Workshop de Node.js",
        descricao: "Aprenda Node.js do zero",
        data: "2025-08-15 09:00:00",
        local: "SENAI - Sala 3",
        capacidade: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Hackathon SENAI 2025",
        descricao: "Maratona de programação",
        data: "2025-09-20 08:00:00",
        local: "SENAI - Auditório",
        capacidade: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Palestra sobre APIs REST",
        descricao: "Como construir APIs profissionais",
        data: "2025-10-10 14:00:00",
        local: "SENAI - Sala 5",
        capacidade: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Inserir participantes
    await queryInterface.bulkInsert("participantes", [
      {
        nome: "Ana Silva",
        email: "ana@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Carlos Souza",
        email: "carlos@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Maria Santos",
        email: "maria@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Inserir inscrições
    await queryInterface.bulkInsert("inscricoes", [
      {
        evento_id: 1,
        participante_id: 1,
        data_inscricao: new Date(),
        status: "confirmada",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        evento_id: 1,
        participante_id: 2,
        data_inscricao: new Date(),
        status: "confirmada",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        evento_id: 2,
        participante_id: 3,
        data_inscricao: new Date(),
        status: "confirmada",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("inscricoes", null, {});
    await queryInterface.bulkDelete("participantes", null, {});
    await queryInterface.bulkDelete("eventos", null, {});
  },
};
```

Execute o seed:

```bash
npx sequelize-cli db:seed:all
```

Verifique no MySQL Workbench:

```sql
SELECT * FROM eventos;
SELECT * FROM participantes;
SELECT * FROM inscricoes;
```

> ✅ Se os dados aparecerem, os seeds funcionaram!

---

## 🔧 Atualizando o server.js

Agora que usamos Migrations, **remova o `sync`** do server.js:

```javascript
async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL estabelecida com sucesso!");

    // REMOVIDO: await sequelize.sync({ alter: true });
    // Agora usamos Migrations para gerenciar o esquema do banco

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar:", erro.message);
    process.exit(1);
  }
}
```

Adicione scripts no `package.json` para facilitar:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "db:migrate": "npx sequelize-cli db:migrate",
  "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
  "db:seed": "npx sequelize-cli db:seed:all",
  "db:seed:undo": "npx sequelize-cli db:seed:undo:all",
  "db:reset": "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"
}
```

> 💡 O script `db:reset` é muito útil durante o desenvolvimento — ele apaga tudo, recria as tabelas e insere os dados de exemplo.

---

## ✅ Checklist — Antes de Sair

- [ ] Sequelize CLI instalado e `.sequelizerc` configurado
- [ ] Migration de `eventos` criada e executada
- [ ] Migration de `participantes` criada e executada
- [ ] Migration de `inscricoes` criada e executada (com FKs)
- [ ] Migration de `notificacoes` criada e executada (desafio)
- [ ] Seed com dados iniciais criado e executado
- [ ] `server.js` atualizado (removido sync, usando migrations)
- [ ] Scripts de banco adicionados ao `package.json`
- [ ] Commit e push

---

> **Próxima aula:** Vamos integrar o Sequelize com a API — substituir os arrays por consultas reais ao banco de dados!
