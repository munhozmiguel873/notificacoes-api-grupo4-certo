# Relatório de Análise e Correções — API Grupo 4

> Gerado em: 26/05/2026

## Resumo

O grupo avançou bastante além do conteúdo das aulas (implementou paginação, filtros, `listarFuturos`, templates, `NotificacaoService`), mas acumulou **bugs críticos que impedem a aplicação de iniciar**. Há também vários bugs de runtime que causariam falhas em rotas específicas.

---

## 🔴 Bugs Críticos (travam a aplicação)

### 1. `src/models/InscricaoModel.js` — Padrão errado

O model usa o padrão de factory function (`module.exports = (sequelize, DataTypes) => {...}`) em vez do padrão do projeto, onde cada model importa o `sequelize` diretamente. O `models/index.js` faz `const Inscricao = require('./InscricaoModel')` e tenta usar como Model, mas o `require` retorna uma **função**, não um Model. Toda chamada como `Inscricao.findAll()` vai jogar `TypeError: Inscricao.findAll is not a function`.

**Correção:** Reescrever no padrão do projeto (igual aos outros models):

```javascript
// src/models/InscricaoModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inscricao = sequelize.define("Inscricao", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dataInscricao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "data_inscricao",
  },
  status: {
    type: DataTypes.ENUM("confirmada", "cancelada"),
    allowNull: false,
    defaultValue: "confirmada",
  },
}, {
  tableName: "inscricoes",
  timestamps: true,
  underscored: true,
});

module.exports = Inscricao;
```

> ⚠️ As FKs (`evento_id`, `participante_id`) **não** entram aqui — o `models/index.js` já as cria automaticamente via `hasMany`/`belongsTo`.

---

### 2. `src/routes/eventoRoutes.js` — `upload` declarado duas vezes + rota duplicada

- `const upload = require('../config/upload')` aparece nas **linhas 5 e 259** — re-declarar um `const` na mesma scope é `SyntaxError` e impede o arquivo de carregar.
- A rota `POST /:id/banner` está **duplicada** (linhas 232–257 e 262–285).

**Correção:** Manter apenas o `require` da linha 5 e apagar as linhas 259–285 inteiras (o segundo bloco duplicado).

---

### 3. `src/routes/exportRoutes.js` — código de outra rota colado no final

As últimas linhas do arquivo (104–115) são código copiado de `eventoRoutes.js` por engano:

```javascript
// src/routes/eventoRoutes.js  ← comentário errado aqui
const cacheMiddleware = require('../middlewares/cacheMiddleware');
router.get('/', cacheMiddleware(30), EventoController.index);  // EventoController não existe aqui!
router.get('/:id', cacheMiddleware(60), EventoController.show);
module.exports = router;
```

`EventoController` nunca foi importado em `exportRoutes.js` — isso joga `ReferenceError: EventoController is not defined` quando o arquivo carrega, impedindo o servidor de iniciar.

**Correção:** Apagar as linhas 104–115 do `exportRoutes.js`. O `module.exports = router` correto já estava na linha 103 e foi sobrescrito por engano.

---

### 4. `src/server.js` — `EmailService.inicializar()` não é chamado

O `server.js` nunca chama `EmailService.inicializar()`. O `notificacaoObserver.js` chama `EmailService.enviar()`, que verifica internamente `if (!transporter)` e joga `Error: EmailService não inicializado` — todas as inscrições criadas vão falhar silenciosamente no envio de e-mail.

**Correção:** Adicionar a inicialização no `server.js`:

```javascript
// src/server.js
require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const EmailService = require('./services/EmailService');  // ← adicionar este require

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL estabelecida com sucesso!");

    await EmailService.inicializar();  // ← adicionar esta linha

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar:", erro.message);
    process.exit(1);
  }
}

iniciar();
```

---

## 🟠 Bugs de Runtime (falham em rotas específicas)

### 5. `src/events/notificacaoObserver.js` — nome de campo errado em `Notificacao.create()`

Ambas as chamadas `salvarNotificacao({...})` usam `destinatario_email` (nome da coluna no banco) em vez de `destinatarioEmail` (nome do atributo JS definido no Model). O Sequelize ignora campos desconhecidos e deixa `destinatarioEmail` como `null`, jogando:

```
SequelizeValidationError: Notificacao.destinatarioEmail cannot be null
```

**Correção:** Nos dois blocos do `notificacaoObserver.js`, trocar `destinatario_email` por `destinatarioEmail`:

```javascript
await salvarNotificacao({
  inscricao_id: inscricao.id,
  tipo: 'confirmacao',
  destinatarioEmail: participante.email,  // ← era destinatario_email
  assunto,
  conteudo: html,
  data_envio: new Date(),
  enviada: true,
});
```

> 💡 **Regra importante:** O `field: "destinatario_email"` no Model serve apenas para mapear a coluna no banco. No código JavaScript, sempre use o nome do atributo em camelCase (`destinatarioEmail`).

---

### 6. `src/events/notificacaoObserver.js` — `tipo: 'cancelamento'` não existe no ENUM

O `NotificacaoModel` define `ENUM("confirmacao", "lembrete")`. O observer de cancelamento usa `tipo: 'cancelamento'`, que não é um valor válido:

```
SequelizeValidationError: ENUM has invalid value cancelamento
```

**Correção:** Trocar `tipo: 'cancelamento'` por `tipo: 'confirmacao'` no bloco do observer `inscricao:cancelada` (o campo `tipo` não tem um valor específico para cancelamento no modelo atual — o tipo `'lembrete'` seria para lembretes futuros, e `'confirmacao'` abrange as notificações transacionais).

---

### 7. `src/controllers/EventoController.js` — chama método que não existe no Service

O método `destroy` chama `EventoService.excluir(id)`, mas o `EventoService` exporta a função como `deletar`, não `excluir`. Todo `DELETE /eventos/:id` vai jogar:

```
TypeError: EventoService.excluir is not a function
```

**Correção:** Na linha 56 do `EventoController.js`, trocar:

```javascript
await EventoService.excluir(id);   // ← errado
```

por:

```javascript
await EventoService.deletar(id);   // ← correto
```

---

### 8. `src/services/NotificacaoService.js` — nome de campo errado em `reenviar()`

O método `reenviar()` acessa `notificacao.destinatario_email` (nome da coluna no banco) em vez de `notificacao.destinatarioEmail` (atributo JS). O Sequelize expõe o atributo pelo nome JS, então `destinatario_email` retorna `undefined` — o e-mail é reenviado para `undefined`.

**Correção:** Na linha 58 do `NotificacaoService.js`, trocar:

```javascript
notificacao.destinatario_email   // ← errado
```

por:

```javascript
notificacao.destinatarioEmail    // ← correto
```

---

## 🟡 Implementações Incompletas

### 9. `src/services/ParticipanteService.js` — `atualizar` e `deletar` são stubs vazios

`atualizar` e `deletar` estão marcados como `/* TODO */` e retornam `undefined`. O `ParticipanteController` chama ambos normalmente:
- `PUT /participantes/:id` vai retornar `null` sem erro (comportamento silencioso incorreto)
- `DELETE /participantes/:id` vai tentar chamar `undefined` como uma função e crashar

**Correção:** Implementar os dois métodos:

```javascript
async function atualizar(id, dados) {
  const participante = await Participante.findByPk(id);
  if (!participante) throw new NotFoundError('Participante');
  await participante.update(dados);
  return participante;
}

async function deletar(id) {
  const participante = await Participante.findByPk(id);
  if (!participante) throw new NotFoundError('Participante');
  await participante.destroy();
  return true;
}
```

---

## 🔵 Problemas de Arquitetura

### 10. `src/server.js` — ainda usa `sequelize.sync({ alter: true })`

A Aula 14 orienta remover o `sync` e usar apenas Migrations. O grupo implementou as migrations corretamente mas manteve o `sync` ativo — isso causa conflito e comportamento imprevisível quando o banco já tem tabelas com dados.

**Correção:** Remover as linhas 11–12 do `server.js`:

```javascript
// REMOVER estas duas linhas:
await sequelize.sync({ alter: true });
console.log("Tabelas sincronizadas com o banco de dados.");
```

---

### 11. `src/services/MailService.js` — serviço duplicado com IP hardcoded

É um serviço criado para o desafio de boas-vindas da Aula 22, mas usa `localhost:1025` fixo (ignora variáveis de ambiente), tem uma API diferente (`enviarEmail({ to, subject, text })`) e não segue o padrão do projeto. O `EmailService.js` já faz tudo que este serviço faz.

**Correção:** Apagar o arquivo `MailService.js`. Para o desafio de boas-vindas, usar o `EmailService` padrão (`EmailService.enviar()`).

---

### 12. `src/events/participanteObserver.js` — importa arquivo que não existe

Importa `require("../events/participanteEvents")` que não existe no projeto. O arquivo não está carregado no `app.js` (por isso não crasha agora), mas se alguém adicionar o `require` no `app.js`, vai dar `Error: MODULE_NOT_FOUND`.

**Correção:** Reescrever usando o `appEmitter` e `EmailService` padrão:

```javascript
// src/events/participanteObserver.js
const appEmitter = require('./eventEmitter');
const EmailService = require('../services/EmailService');

appEmitter.on('participante:criado', async (participante) => {
  try {
    await EmailService.enviar(
      participante.email,
      'Bem-vindo à Plataforma de Eventos!',
      `<p>Bem-vindo(a), <strong>${participante.nome}</strong>!</p>`
    );
    console.log(`[OBSERVER] E-mail de boas-vindas enviado para ${participante.email}`);
  } catch (err) {
    console.error('[OBSERVER] Erro ao enviar boas-vindas:', err.message);
  }
});
```

> Lembrar também de emitir `appEmitter.emit('participante:criado', novoParticipante)` no `ParticipanteService.criar()` e de adicionar `require('./events/participanteObserver')` no `app.js`.

---

## Tabela Resumo — Ordem de Correção Sugerida

| Prioridade | Arquivo | Problema |
|---|---|---|
| 1 | `models/InscricaoModel.js` | Padrão factory function — trava tudo |
| 2 | `routes/exportRoutes.js` | Código colado no final — trava tudo |
| 3 | `routes/eventoRoutes.js` | `const upload` duplicado — SyntaxError |
| 4 | `server.js` | `EmailService.inicializar()` ausente |
| 5 | `controllers/EventoController.js` | Chama `EventoService.excluir` que não existe |
| 6 | `events/notificacaoObserver.js` | `destinatario_email` → `destinatarioEmail` (2 locais) |
| 7 | `events/notificacaoObserver.js` | `tipo: 'cancelamento'` inválido no ENUM |
| 8 | `services/NotificacaoService.js` | `destinatario_email` → `destinatarioEmail` |
| 9 | `services/ParticipanteService.js` | `atualizar` e `deletar` são stubs `/* TODO */` |
| 10 | `server.js` | Remover `sequelize.sync({ alter: true })` |
| 11 | `services/MailService.js` | Serviço duplicado — apagar |
| 12 | `events/participanteObserver.js` | Importa `participanteEvents` que não existe |

---

> **Nota:** Os itens 1, 2 e 3 são os mais urgentes — enquanto existirem, o servidor não sobe. Corrija-os primeiro e teste se a aplicação inicia antes de partir para os demais.
