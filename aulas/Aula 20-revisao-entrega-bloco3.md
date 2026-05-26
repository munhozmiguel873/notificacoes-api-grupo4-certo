# Aula 20 — Revisão Final e Entrega do Bloco 3

> **Bloco 3** · Quinta-feira · Semana 10 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Última aula do Bloco 3! Hoje é dedicada a **revisão, ajustes e entrega**. Vamos fazer uma verificação completa da API, atualizar a documentação e garantir que tudo está pronto.

**O que você vai produzir hoje:**
- [x] Teste completo da API (roteiro de testes)
- [x] Atualização do Swagger com as novas rotas
- [x] Atualização do README.md
- [x] Exportação atualizada do Postman
- [x] Entrega final do Bloco 3

---

## 🧪 Parte 1 — Roteiro de Testes Completo

Sigam este roteiro no Postman. Marquem cada teste que passar:

### Eventos

- [x] `GET /eventos` → retorna lista paginada com metadados
- [x] `GET /eventos?busca=Workshop` → filtra por nome
- [x] `GET /eventos/1` → retorna evento com todos os campos
- [x] `GET /eventos/9999` → retorna 404 formatado
- [x] `POST /eventos` com dados válidos → 201, retorna com ID e timestamps
- [x] `POST /eventos` sem nome → 400, mensagem de validação
- [x] `POST /eventos` com capacidade negativa → 400
- [x] `PUT /eventos/1` → atualiza campos parcialmente
- [x] `DELETE /eventos/1` → 204
- [x] `POST /eventos/2/banner` com imagem → upload funciona

### Participantes

- [x] `GET /participantes` → lista todos
- [x] `POST /participantes` com dados válidos → 201
- [x] `POST /participantes` com email duplicado → 409 (conflito)
- [x] `POST /participantes` com email inválido → 400

### Inscrições

- [x] `POST /inscricoes` com IDs válidos → 201
- [x] `POST /inscricoes` duplicada → 400, "já inscrito"
- [x] `POST /inscricoes` com evento inexistente → 404
- [x] `GET /inscricoes` → lista com dados de evento e participante (include)
- [x] `GET /inscricoes/evento/2` → filtra por evento
- [x] `PATCH /inscricoes/1/cancelar` → status muda para "cancelada"

### Exportação e Relatórios

- [x] `GET /exportar/eventos/xml` → retorna XML válido
- [x] `GET /exportar/eventos/json` → retorna JSON para download
- [x] `GET /exportar/relatorio/inscricoes` → retorna relatório formatado

### Infraestrutura

- [x] `GET /rota-invalida` → 404 padronizado (middleware notFound)
- [x] Cache funciona (segundo GET é mais rápido)
- [x] **Reiniciar servidor** → dados persistem
- [x] `npm run db:reset` → limpa e recria tudo com seeds
- [x] Swagger acessível em `/api-docs`

---

## 📋 Parte 2 — Atualizando a Documentação

### README.md atualizado

Atualizem o README para refletir o estado atual:

```markdown
## 🔧 Scripts

|          Comando          |              Descrição               |
|---------------------------|--------------------------------------|
| `npm start`               | Inicia o servidor (produção)         |
| `npm run dev`             | Inicia com Nodemon (desenvolvimento) |
| `npm run db:migrate`      | Executa migrations pendentes         |
| `npm run db:migrate:undo` | Desfaz última migration              |
| `npm run db:seed`         | Insere dados iniciais                |
| `npm run db:reset`        | Recria banco completo                |

## 🗄️ Banco de Dados

- **SGBD:** MySQL
- **ORM:** Sequelize
- **Tabelas:** eventos, participantes, inscricoes, notificacoes

## 📁 Estrutura do Projeto

```
src/
├── config/          → Banco de dados, upload, cache
├── controllers/     → Recebe requisições, retorna respostas
├── database/
│   ├── migrations/  → Versionamento do esquema do banco
│   └── seeders/     → Dados iniciais para desenvolvimento
├── errors/          → Classes de erro customizadas
├── helpers/         → Funções auxiliares (validação)
├── middlewares/     → Logger, CORS, erros, cache
├── models/          → Modelos Sequelize (tabelas do banco)
├── routes/          → Mapeamento de URLs
├── services/        → Lógica de negócio
├── swagger.js       → Configuração da documentação
├── app.js           → Configuração do Express
└── server.js        → Inicialização do servidor
```
```

### Collection do Postman

1. Atualizem a collection com todas as novas rotas
2. Organizem em pastas: Eventos, Participantes, Inscrições, Exportação
3. Exportem para `docs/postman-collection.json`

---

## 🏁 Resumo do Bloco 3 — O Que Vocês Construíram

|  Aula  |                      O que foi feito                      |
|--------|-----------------------------------------------------------|
| **12** | Revisão BD relacional, conexão MySQL com Express          |
| **13** | Models Sequelize com validações e relacionamentos         |
| **14** | Migrations (versionamento do BD) e Seeds (dados iniciais) |
| **15** | CRUD Create/Read com banco real — dados persistem!        |
| **16** | CRUD Update/Delete, migração completa de Inscrições       |
| **17** | Paginação, filtros, exportação JSON e XML                 |
| **18** | Upload de arquivos com Multer, relatórios                 |
| **19** | Cache em memória, consolidação de tudo                    |
| **20** | Revisão, testes, documentação e entrega                   |

### A evolução do projeto

```
Bloco 1: API simples → dados em arrays, sem organização
Bloco 2: API organizada → MVC, Services, validação, tratamento de erros
Bloco 3: API profissional → banco de dados real, persistência, exportação, cache
```

---

## 📂 Estrutura final do projeto (Bloco 3)

```
notificacoes-api/
├── src/
│   ├── config/
│   │   ├── database.js          → Conexão Sequelize
│   │   ├── database.json        → Config do CLI
│   │   ├── upload.js            → Config do Multer
│   │   └── cache.js             → Config do cache
│   ├── database/
│   │   ├── migrations/          → 5 migrations
│   │   └── seeders/             → Dados iniciais
│   ├── errors/
│   │   └── AppError.js
│   ├── helpers/
│   │   └── validators.js
│   ├── middlewares/
│   │   ├── cacheMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── responseTime.js
│   ├── models/
│   │   ├── index.js             → Relacionamentos
│   │   ├── EventoModel.js       → Sequelize
│   │   ├── ParticipanteModel.js → Sequelize
│   │   ├── InscricaoModel.js    → Sequelize
│   │   └── NotificacaoModel.js  → Sequelize
│   ├── services/
│   │   ├── EventoService.js     → Async + Sequelize
│   │   ├── ParticipanteService.js
│   │   └── InscricaoService.js
│   ├── controllers/
│   ├── routes/
│   │   ├── eventoRoutes.js
│   │   ├── participanteRoutes.js
│   │   ├── inscricaoRoutes.js
│   │   └── exportRoutes.js      → XML, JSON, relatórios
│   ├── swagger.js
│   ├── app.js
│   └── server.js
├── uploads/                      → Arquivos enviados (não vai pro Git)
├── docs/
│   ├── diagrama-classes.png
│   └── postman-collection.json
├── .env
├── .env.example
├── .sequelizerc
├── .gitignore
├── package.json
└── README.md
```

---

## 🔮 O Que Vem no Bloco 4

No próximo bloco, vamos dar vida ao **módulo de notificações**:

- **Nodemailer** — enviar e-mails de verdade (simulados)
- **Templates de e-mail** — confirmação de inscrição, lembretes
- **Padrão Observer** — notificar automaticamente quando algo acontece
- **Regras de negócio** — quando enviar, para quem, histórico

O Model de Notificação que criamos neste bloco vai finalmente ser usado!

---

## ✅ Checklist Final — Entrega do Bloco 3

### Banco de Dados:
- [ ] MySQL configurado e conectado
- [ ] 4 Models Sequelize com validações e relacionamentos
- [ ] Migrations para todas as tabelas
- [ ] Seeds com dados iniciais
- [ ] Scripts de banco no package.json (migrate, seed, reset)

### CRUD:
- [ ] CRUD completo de Eventos com Sequelize
- [ ] CRUD completo de Participantes com Sequelize
- [ ] Inscrições com validações de duplicata e existência
- [ ] Dados persistem entre reinícios do servidor

### Funcionalidades:
- [ ] Paginação e filtros no GET /eventos
- [ ] Exportação em XML e JSON
- [ ] Upload de arquivos (banner de evento)
- [ ] Relatório de inscrições
- [ ] Cache em memória

### Documentação:
- [ ] Swagger atualizado com novas rotas
- [ ] README.md completo
- [ ] Collection Postman atualizada em docs/
- [ ] .env.example com todas as variáveis

### Git:
- [ ] Repositório atualizado
- [ ] Todos os membros com commits
- [ ] .env e uploads/ no .gitignore

---

> **Parabéns por completar o Bloco 3!** 🎉 Vocês saíram de arrays em memória para um banco de dados real com ORM, migrations, cache e exportação. Isso é desenvolvimento back-end profissional.