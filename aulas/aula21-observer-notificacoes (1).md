# Aula 21 — Padrão Observer + Introdução ao Módulo de Notificações

> **Bloco 4** · Terça-feira · Semana 11 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje começa o **Bloco 4** — o momento em que a tabela `notificacoes` (que está vazia desde o Bloco 3) finalmente ganha vida! Vamos aprender o **Padrão Observer** e usá-lo para disparar notificações automaticamente quando algo acontece no sistema.

**O que você vai produzir hoje:**
- [x] Entender o que são Design Patterns e por que existem
- [x] Aprender o Padrão Observer e implementá-lo em JavaScript
- [x] Criar o NotificacaoService
- [x] Disparar notificação automaticamente ao criar uma inscrição

---

## 🧩 Parte 1 — O Que São Design Patterns?

**Design Patterns** (padrões de projeto) são soluções reutilizáveis para problemas comuns em desenvolvimento de software. Não são código pronto — são **receitas** que você adapta ao seu contexto.

Existem dezenas de padrões, organizados em 3 categorias:

| Categoria | Para quê | Exemplos |
|---|---|---|
| **Criação** | Como criar objetos | Factory, Singleton, Builder |
| **Estrutura** | Como organizar classes/objetos | Adapter, Decorator, Facade |
| **Comportamento** | Como objetos se comunicam | **Observer**, Strategy, Command |

### Alguns padrões que vocês já usam (sem saber!)

| Padrão | Onde vocês já usam |
|---|---|
| **Singleton** | A conexão do Sequelize — existe apenas uma instância compartilhada |
| **Middleware/Chain of Responsibility** | Os middlewares do Express — cada um processa e passa para o próximo |
| **MVC** | A estrutura inteira do projeto! |
| **Repository** | Os Models do Sequelize abstraem o acesso ao banco |

> 💡 Hoje vamos focar no **Observer**, que é o mais útil para o nosso módulo de notificações.

---

## 👁️ Parte 2 — O Padrão Observer

### O problema

Quando um participante se inscreve em um evento, queremos:
1. Salvar a inscrição no banco ✅ (já fazemos)
2. Enviar um e-mail de confirmação ❌ (ainda não)
3. No futuro: talvez enviar SMS, push notification, atualizar dashboard...

A solução **ruim** seria colocar tudo no `InscricaoService.criar()`:

```javascript
// ❌ Ruim — o Service de Inscrição sabe demais
async function criar(dados) {
  const inscricao = await Inscricao.create(dados);
  await enviarEmailConfirmacao(inscricao);  // acoplado!
  await enviarSMS(inscricao);              // mais acoplamento!
  await atualizarDashboard(inscricao);     // cada vez pior!
  return inscricao;
}
```

Problema: cada nova funcionalidade obriga a mexer no Service de Inscrição. E se o envio de e-mail falhar, a inscrição falha junto.

### A solução: Observer

O Observer funciona como uma **lista de inscritos em um canal do YouTube**:

- O **canal** (Subject/Emissor) publica um vídeo
- Todos os **inscritos** (Observers/Ouvintes) são notificados automaticamente
- O canal não precisa saber quem são os inscritos nem o que eles fazem com a notificação

```
InscricaoService:  "Nova inscrição criada!"
    │
    ├──→ NotificacaoObserver: "Ok, vou enviar e-mail de confirmação"
    ├──→ LogObserver: "Ok, vou registrar no log"
    └──→ FuturoObserver: "Ok, vou enviar push notification"
```

O InscricaoService não precisa saber que esses observers existem — ele apenas **emite um evento**.

---

## 🛠️ Parte 3 — Implementando com EventEmitter

O Node.js já tem um mecanismo de Observer embutido: o **EventEmitter**.

### Passo 1: Criar o emissor de eventos

Crie `src/events/eventEmitter.js`:

```javascript
// src/events/eventEmitter.js
const EventEmitter = require('events');

// Um único emissor compartilhado por toda a aplicação
const appEmitter = new EventEmitter();

module.exports = appEmitter;
```

### Passo 2: Criar o observer de notificações

Crie `src/events/notificacaoObserver.js`:

```javascript
// src/events/notificacaoObserver.js
const appEmitter = require('./eventEmitter');
const { Notificacao, Participante, Evento, Inscricao } = require('../models');

// Observer: escuta o evento 'inscricao:criada'
appEmitter.on('inscricao:criada', async (inscricao) => {
  try {
    console.log(`[OBSERVER] Nova inscrição detectada: #${inscricao.id}`);

    // Buscar dados completos para montar a notificação
    const inscricaoCompleta = await Inscricao.findByPk(inscricao.id, {
      include: [
        { model: Evento, as: 'evento' },
        { model: Participante, as: 'participante' },
      ],
    });

    if (!inscricaoCompleta) return;

    const { evento, participante } = inscricaoCompleta;

    // Criar a notificação no banco
    const notificacao = await Notificacao.create({
      inscricao_id: inscricao.id,
      tipo: 'confirmacao',
      destinatario_email: participante.email,
      assunto: `Inscrição confirmada: ${evento.nome}`,
      conteudo: `Olá ${participante.nome}! Sua inscrição no evento "${evento.nome}" foi confirmada.`,
      enviada: false,
    });

    console.log(`[OBSERVER] Notificação #${notificacao.id} criada para ${participante.email}`);
  } catch (erro) {
    // O observer não deve derrubar a aplicação se falhar
    console.error('[OBSERVER] Erro ao criar notificação:', erro.message);
  }
});

// Observer: escuta 'inscricao:cancelada'
appEmitter.on('inscricao:cancelada', async (inscricao) => {
  try {
    console.log(`[OBSERVER] Inscrição #${inscricao.id} cancelada`);
    // Aqui poderíamos enviar um e-mail de cancelamento
    // Por enquanto, apenas logamos
  } catch (erro) {
    console.error('[OBSERVER] Erro:', erro.message);
  }
});
```

### Passo 3: Registrar os observers ao iniciar

No `src/app.js`, adicione (no topo, junto com os outros requires):

```javascript
// Registrar observers (basta importar para ativar)
require('./events/notificacaoObserver');
```

### Passo 4: Emitir eventos no InscricaoService

Atualize o `InscricaoService.js` — na função `criar`, emita o evento **depois** de salvar a inscrição:

```javascript
// No topo do InscricaoService.js:
const appEmitter = require('../events/eventEmitter');

async function criar(dados) {
  // ... validações e criação existentes ...

  const novaInscricao = await Inscricao.create({
    evento_id: eventoId,
    participante_id: participanteId,
  });

  // Emitir evento — os observers serão notificados
  appEmitter.emit('inscricao:criada', novaInscricao);

  return novaInscricao;
}

async function cancelar(id) {
  // ... lógica existente ...

  await inscricao.update({ status: 'cancelada' });

  // Emitir evento de cancelamento
  appEmitter.emit('inscricao:cancelada', inscricao);

  return inscricao;
}
```

### Entendendo o fluxo completo

```
POST /inscricoes
    → InscricaoController.store()
        → InscricaoService.criar()
            → Inscricao.create() (salva no banco)
            → appEmitter.emit('inscricao:criada')
                → notificacaoObserver escuta
                    → Notificacao.create() (salva notificação no banco)
    → res.status(201).json(inscricao)
```

> 💡 Perceba que a inscrição **não espera** a notificação ser criada (o emit é assíncrono por design). Mesmo que o observer falhe, a inscrição já foi salva.

---

## 🧪 Parte 4 — Testando

### Teste 1: Criar uma inscrição e ver a notificação

```
POST /inscricoes
Body: { "eventoId": 1, "participanteId": 1 }
```

No terminal, você deve ver:

```
[OBSERVER] Nova inscrição detectada: #1
[OBSERVER] Notificação #1 criada para ana@email.com
```

### Teste 2: Verificar no banco

```sql
SELECT * FROM notificacoes;
```

Deve haver uma notificação com `tipo = 'confirmacao'`, `enviada = false` e os dados do participante.

### Teste 3: Criar rota para listar notificações

Adicione rapidamente em `src/routes/notificacaoRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { Notificacao, Inscricao, Evento, Participante } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const notificacoes = await Notificacao.findAll({
      include: [{
        model: Inscricao,
        as: 'inscricao',
        include: [
          { model: Evento, as: 'evento', attributes: ['nome'] },
          { model: Participante, as: 'participante', attributes: ['nome', 'email'] },
        ],
      }],
      order: [['created_at', 'DESC']],
    });
    res.json(notificacoes);
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
```

Registre no `app.js`:

```javascript
const notificacaoRoutes = require('./routes/notificacaoRoutes');
app.use('/notificacoes', notificacaoRoutes);
```

---

## 🧩 Desafio — Mais Observers

Dividam no grupo:

**Membro 1:** Crie um observer de **log** que registra todas as ações importantes em um arquivo `logs/app.log`:

```javascript
// src/events/logObserver.js
appEmitter.on('inscricao:criada', (inscricao) => {
  const fs = require('fs');
  const linha = `[${new Date().toISOString()}] Inscrição #${inscricao.id} criada\n`;
  fs.appendFileSync('logs/app.log', linha);
});
```

**Membro 2:** Emita um evento `evento:criado` no `EventoService.criar()` e crie um observer que loga a criação de eventos.

---

## 📂 Estrutura atualizada do projeto

```
notificacoes-api/
├── src/
│   ├── events/               ✅ NOVO
│   │   ├── eventEmitter.js
│   │   └── notificacaoObserver.js
│   ├── routes/
│   │   └── notificacaoRoutes.js  ✅ NOVO
│   ├── ...
│   └── app.js                ✅ ATUALIZADO
└── logs/                      ✅ NOVO (se fizerem o desafio)
```

---

## ✅ Checklist — Antes de Sair

- [ ] Entendi o que são Design Patterns e conheço os principais (Observer, Singleton, Factory)
- [ ] Entendi o Padrão Observer e como ele desacopla componentes
- [ ] EventEmitter configurado como emissor central
- [ ] NotificacaoObserver criado — escuta 'inscricao:criada'
- [ ] InscricaoService emite eventos ao criar e cancelar
- [ ] Notificações são criadas automaticamente no banco ao inscrever
- [ ] Rota GET /notificacoes funcionando
- [ ] Commit e push

---

> **Próxima aula:** Vamos configurar o Nodemailer para enviar e-mails de verdade (simulados) — os alunos vão ver o e-mail chegando!
