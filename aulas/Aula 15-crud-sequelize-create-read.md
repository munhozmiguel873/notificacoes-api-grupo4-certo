# Aula 15 — CRUD com Sequelize: Create e Read

> **Bloco 3** · Terça-feira · Semana 8 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje é o grande dia: vamos **substituir os arrays em memória por consultas reais ao banco de dados**! Começamos pelo Create e Read. Ao final, os dados vão sobreviver ao reinício do servidor.

**O que você vai produzir hoje:**
- [x] Reescrever o EventoService para usar Sequelize
- [x] Implementar Create (POST) e Read (GET) com banco de dados real
- [x] Testar e confirmar que os dados persistem entre reinícios
- [x] Iniciar a migração do ParticipanteService (desafio em grupo)

---

## 🔄 O Que Muda?

A beleza da arquitetura em camadas que construímos no Bloco 2 é que **só precisamos alterar os Services**. Controllers e Routes continuam iguais!

```
Controller → Service → Model (Sequelize)
                          ↕
                     Banco MySQL
```

O Controller continua chamando `EventoService.criar(dados)`. Mas agora o Service, em vez de usar `EventoModel.criar()` (que salvava no array), vai usar `Evento.create()` (que salva no banco).

---

## 🛠️ Parte 1 — Reescrevendo o EventoService

A principal diferença: todas as operações do Sequelize são **assíncronas** (retornam Promises). Então precisamos usar `async/await`.

### EventoService completo com Sequelize (Create e Read):

```javascript
// src/services/EventoService.js
const { Evento } = require('../models');
const { NotFoundError, ValidationError } = require('../errors/AppError');

async function listarTodos() {
  const eventos = await Evento.findAll({
    order: [['data', 'ASC']],
  });
  return eventos;
}

async function buscarPorId(id) {
  const evento = await Evento.findByPk(id);

  if (!evento) {
    throw new NotFoundError('Evento');
  }

  return evento;
}

async function criar(dados) {
  try {
    const novoEvento = await Evento.create(dados);
    return novoEvento;
  } catch (erro) {
    // O Sequelize lança SequelizeValidationError para validações do Model
    if (erro.name === 'SequelizeValidationError') {
      const mensagens = erro.errors.map(e => e.message).join('; ');
      throw new ValidationError(mensagens);
    }
    throw erro;
  }
}

// Atualizar e Deletar vamos implementar na próxima aula
async function atualizar(id, dados) {
  // TODO: próxima aula
}

async function deletar(id) {
  // TODO: próxima aula
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
};
```

### Entendendo os métodos do Sequelize

| Método | SQL equivalente | Para quê |
|---|---|---|
| `Evento.findAll()` | `SELECT * FROM eventos` | Listar todos |
| `Evento.findByPk(id)` | `SELECT * FROM eventos WHERE id = ?` | Buscar por chave primária |
| `Evento.create(dados)` | `INSERT INTO eventos (...) VALUES (...)` | Criar novo registro |
| `Evento.findAll({ order: [...] })` | `SELECT * ... ORDER BY data ASC` | Listar com ordenação |

> 💡 Perceba que **removemos as validações manuais** do Service (isRequired, minLength...). As validações agora ficam no Model do Sequelize (`validate: {...}`). Se os dados forem inválidos, o Sequelize lança `SequelizeValidationError` automaticamente.

---

## 🔧 Parte 2 — Atualizando o Controller

O Controller precisa de uma pequena mudança: como os Services agora são **async**, os métodos do Controller também precisam ser:

```javascript
// src/controllers/EventoController.js
const EventoService = require('../services/EventoService');

async function index(req, res, next) {
  try {
    const eventos = await EventoService.listarTodos();
    res.json(eventos);
  } catch (erro) {
    next(erro);
  }
}

async function show(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const evento = await EventoService.buscarPorId(id);
    res.json(evento);
  } catch (erro) {
    next(erro);
  }
}

async function store(req, res, next) {
  try {
    const novoEvento = await EventoService.criar(req.body);
    res.status(201).json(novoEvento);
  } catch (erro) {
    next(erro);
  }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const eventoAtualizado = await EventoService.atualizar(id, req.body);
    res.json(eventoAtualizado);
  } catch (erro) {
    next(erro);
  }
}

async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await EventoService.deletar(id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { index, show, store, update, destroy };
```

> A mudança é sutil: `function` virou `async function` e as chamadas ao Service agora têm `await`.

---

## 🧪 Parte 3 — Testando Create e Read

### Teste 1: Listar eventos (dados do Seed)

```
GET http://localhost:3000/eventos
```

Deve retornar os 3 eventos que inserimos via Seed. Observe no terminal as queries SQL que o Sequelize gera!

### Teste 2: Criar um evento novo

```
POST http://localhost:3000/eventos
Body (JSON):
{
  "nome": "Meetup de JavaScript",
  "descricao": "Encontro mensal de devs JS",
  "data": "2025-11-15T19:00:00.000Z",
  "local": "Online",
  "capacidade": 200
}
```

Deve retornar **201 Created** com o evento criado (incluindo `id`, `createdAt` e `updatedAt`).

### Teste 3: Persistência! 🎉

Este é o teste mais importante:

1. Crie um evento via POST
2. Pare o servidor (`Ctrl+C`)
3. Inicie novamente (`npm run dev`)
4. Faça `GET /eventos`
5. O evento que você criou **ainda está lá**!

> ✅ Se passou neste teste, a persistência está funcionando!

### Teste 4: Validação do Sequelize

```
POST http://localhost:3000/eventos
Body (JSON):
{
  "nome": "AB",
  "data": null
}
```

Deve retornar **400** com mensagem de validação do Sequelize.

---

## 🔧 Parte 4 — Tratando Erros do Sequelize

O Sequelize pode lançar vários tipos de erro. Vamos atualizar o `errorHandler` para tratar os mais comuns:

```javascript
// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let mensagem = err.message || 'Erro interno do servidor';
  let tipo = err.name || 'Error';

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    tipo = 'ValidationError';
    mensagem = err.errors.map(e => e.message).join('; ');
  }

  // Erros de constraint única (ex: email duplicado)
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    tipo = 'ConflictError';
    mensagem = 'Registro duplicado: ' + err.errors.map(e => e.message).join('; ');
  }

  // Erros de FK (referência inválida)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    tipo = 'ForeignKeyError';
    mensagem = 'Referência inválida: o registro relacionado não existe';
  }

  console.error(`[ERRO] ${tipo}: ${mensagem}`);

  const resposta = { erro: { tipo, mensagem, statusCode } };

  if (process.env.NODE_ENV === 'development') {
    resposta.erro.stack = err.stack;
  }

  res.status(statusCode).json(resposta);
}

module.exports = errorHandler;
```

---

## 🧩 Desafio — Migrar o ParticipanteService

Dividam no grupo: reescreva o `ParticipanteService.js` para usar Sequelize.

```javascript
// src/services/ParticipanteService.js
const { Participante } = require('../models');
const { NotFoundError } = require('../errors/AppError');

async function listarTodos() {
  // Use Participante.findAll() com ordenação por nome
  // _________________________________
}

async function buscarPorId(id) {
  // Use Participante.findByPk(id)
  // Se não encontrar, lance NotFoundError
  // _________________________________
  // _________________________________
  // _________________________________
}

async function criar(dados) {
  // Use Participante.create(dados) com try/catch para erros do Sequelize
  // _________________________________
  // _________________________________
  // _________________________________
  // _________________________________
  // _________________________________
}

// Atualizar e deletar ficam para a próxima aula
async function atualizar(id, dados) { /* TODO */ }
async function deletar(id) { /* TODO */ }

module.exports = { listarTodos, buscarPorId, criar, atualizar, deletar };
```

Não esqueça de atualizar o `ParticipanteController.js` para `async/await`!

**Teste no Postman:**
- `GET /participantes` → lista os 3 do Seed
- `POST /participantes` com `{ "nome": "João", "email": "joao@email.com" }` → 201
- `POST /participantes` com o **mesmo email** → deve dar erro de duplicata (409)!

---

## ✅ Checklist — Antes de Sair

- [ ] EventoService reescrito com Sequelize (listarTodos, buscarPorId, criar)
- [ ] EventoController atualizado com async/await
- [ ] GET /eventos retorna dados do banco (Seeds)
- [ ] POST /eventos cria no banco de dados real
- [ ] **Dados persistem após reiniciar o servidor** 🎉
- [ ] Validações do Sequelize funcionando (nome curto, campos obrigatórios)
- [ ] errorHandler atualizado para erros do Sequelize
- [ ] ParticipanteService migrado (desafio)
- [ ] Commit e push

---

> **Próxima aula:** Vamos completar o CRUD implementando Update e Delete com Sequelize.
