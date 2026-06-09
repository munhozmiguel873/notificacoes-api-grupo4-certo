# Aula 24 — Regras de Negócio e Histórico de Notificações

> **Bloco 4** · Quinta-feira · Semana 12 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Hoje vamos implementar **regras de negócio** para o módulo de notificações: quando enviar, para quem, e como consultar o histórico. Também vamos criar endpoints para gerenciar notificações.

**O que você vai produzir hoje:**
- [x] Implementar regras de negócio no NotificacaoService
- [x] Criar endpoints de consulta de histórico com filtros
- [x] Implementar reenvio de notificação
- [x] Adicionar endpoint de estatísticas

---

## 📋 Parte 1 — Regras de Negócio

Toda aplicação profissional tem regras que vão além do CRUD. No nosso módulo de notificações:

| Regra | Descrição |
|---|---|
| **Não duplicar** | Não enviar confirmação se já foi enviada para a mesma inscrição |
| **Só enviar para inscrição ativa** | Se a inscrição está cancelada, não enviar lembrete |
| **Histórico completo** | Manter registro de toda tentativa de envio (sucesso ou falha) |

### Criando o NotificacaoService completo

```javascript
// src/services/NotificacaoService.js
const { Notificacao, Inscricao, Evento, Participante } = require('../models');
const EmailService = require('./EmailService');
const { NotFoundError } = require('../errors/AppError');

async function listarTodas(filtros = {}) {
  const where = {};

  // Filtrar por tipo (confirmacao, lembrete)
  if (filtros.tipo) {
    where.tipo = filtros.tipo;
  }

  // Filtrar por status de envio
  if (filtros.enviada !== undefined) {
    where.enviada = filtros.enviada === 'true';
  }

  const notificacoes = await Notificacao.findAll({
    where,
    include: [{
      model: Inscricao,
      as: 'inscricao',
      include: [
        { model: Evento, as: 'evento', attributes: ['id', 'nome'] },
        { model: Participante, as: 'participante', attributes: ['id', 'nome', 'email'] },
      ],
    }],
    order: [['created_at', 'DESC']],
  });

  return notificacoes;
}

async function buscarPorId(id) {
  const notificacao = await Notificacao.findByPk(id, {
    include: [{
      model: Inscricao,
      as: 'inscricao',
      include: [
        { model: Evento, as: 'evento' },
        { model: Participante, as: 'participante' },
      ],
    }],
  });

  if (!notificacao) throw new NotFoundError('Notificação');
  return notificacao;
}

async function reenviar(id) {
  const notificacao = await buscarPorId(id);

  // Regra: só reenviar se não foi enviada com sucesso
  // Ou permitir reenvio explícito (útil para testes)
  const html = notificacao.conteudo;
  const resultado = await EmailService.enviar(
    notificacao.destinatarioEmail,
    notificacao.assunto,
    html
  );

  // Atualizar registro
  await notificacao.update({
    enviada: true,
    dataEnvio: new Date(),
  });

  return {
    notificacao,
    visualizarEm: resultado.visualizarEm,
  };
}

async function obterEstatisticas() {
  const total = await Notificacao.count();
  const enviadas = await Notificacao.count({ where: { enviada: true } });
  const pendentes = await Notificacao.count({ where: { enviada: false } });

  const porTipo = await Notificacao.findAll({
    attributes: [
      'tipo',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'quantidade'],
    ],
    group: ['tipo'],
    raw: true,
  });

  return {
    total,
    enviadas,
    pendentes,
    taxaEnvio: total > 0 ? `${Math.round((enviadas / total) * 100)}%` : '0%',
    porTipo,
  };
}

module.exports = {
  listarTodas,
  buscarPorId,
  reenviar,
  obterEstatisticas,
};
```

---

## 🛤️ Parte 2 — Rotas de Notificação

Atualize `src/routes/notificacaoRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const NotificacaoService = require('../services/NotificacaoService');
const EmailService = require('../services/EmailService');

// GET /notificacoes — listar com filtros
router.get('/', async (req, res, next) => {
  try {
    const notificacoes = await NotificacaoService.listarTodas({
      tipo: req.query.tipo,
      enviada: req.query.enviada,
    });
    res.json(notificacoes);
  } catch (erro) {
    next(erro);
  }
});

// GET /notificacoes/estatisticas — dashboard de envios
router.get('/estatisticas', async (req, res, next) => {
  try {
    const stats = await NotificacaoService.obterEstatisticas();
    res.json(stats);
  } catch (erro) {
    next(erro);
  }
});

// GET /notificacoes/:id — detalhes de uma notificação
router.get('/:id', async (req, res, next) => {
  try {
    const notificacao = await NotificacaoService.buscarPorId(parseInt(req.params.id));
    res.json(notificacao);
  } catch (erro) {
    next(erro);
  }
});

// POST /notificacoes/:id/reenviar — reenviar uma notificação
router.post('/:id/reenviar', async (req, res, next) => {
  try {
    const resultado = await NotificacaoService.reenviar(parseInt(req.params.id));
    res.json({
      mensagem: 'Notificação reenviada com sucesso',
      visualizarEm: resultado.visualizarEm,
    });
  } catch (erro) {
    next(erro);
  }
});

// POST /notificacoes/teste-email — enviar e-mail de teste
router.post('/teste-email', async (req, res, next) => {
  try {
    const resultado = await EmailService.enviar(
      'teste@exemplo.com',
      'Teste da API de Notificações',
      '<h1>Funcionou! 🎉</h1><p>Este e-mail foi enviado pela nossa API.</p>'
    );
    res.json({ mensagem: 'E-mail de teste enviado!', visualizarEm: resultado.visualizarEm });
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
```

### Testando no Postman

```
GET /notificacoes                    → todas as notificações
GET /notificacoes?tipo=confirmacao   → só confirmações
GET /notificacoes?enviada=true       → só as enviadas
GET /notificacoes/estatisticas       → dashboard com contagens
POST /notificacoes/1/reenviar       → reenvia e retorna URL do MailPit
```

---

## 🧩 Desafio — Evitar Duplicatas no Observer

Atualize o observer de `inscricao:criada` para verificar se já existe uma notificação de confirmação para aquela inscrição antes de criar uma nova:

```javascript
// Dentro do observer, ANTES de criar a notificação:

const jaNotificado = await Notificacao.findOne({
  where: {
    inscricao_id: inscricao.id,
    tipo: 'confirmacao',
    // Complete: que outra condição faz sentido aqui?
    // _________________________________
  }
});

if (jaNotificado) {
  console.log('[NOTIFICAÇÃO] Confirmação já enviada, ignorando duplicata');
  return;
}
```

---

## ✅ Checklist — Antes de Sair

- [ ] NotificacaoService criado com listarTodas, buscarPorId, reenviar, estatísticas
- [ ] Filtros por tipo e status de envio funcionando
- [ ] Endpoint de estatísticas retornando contagens
- [ ] Reenvio de notificação funcionando
- [ ] Regra de não duplicar implementada (desafio)
- [ ] Commit e push

---

> **Próxima aula:** Integração completa do módulo — testes, refatoração e preparação para entrega.
