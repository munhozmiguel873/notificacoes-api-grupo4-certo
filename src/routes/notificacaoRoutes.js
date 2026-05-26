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