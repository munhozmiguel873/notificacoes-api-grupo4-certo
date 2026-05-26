// src/controllers/InscricaoController.js
const InscricaoService = require("../services/InscricaoService");

async function store(req, res, next) {
  try {
    const novaInscricao = await InscricaoService.criar(req.body);
    res.status(201).json(novaInscricao);
  } catch (erro) {
    next(erro);
  }
}

async function index(req, res, next) {
  try {
    const inscricoes = await InscricaoService.listarTodas();
    res.json(inscricoes);
  } catch (erro) {
    next(erro);
  }
}

async function listarPorEvento(req, res, next) {
  try {
    const eventoId = parseInt(req.params.eventoId);
    const inscricoes = await InscricaoService.listarPorEvento(eventoId);
    res.json(inscricoes);
  } catch (erro) {
    next(erro);
  }
}

async function cancelar(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const inscricao = await InscricaoService.cancelar(id);
    res.json(inscricao);
  } catch (erro) {
    next(erro);
  }
}

module.exports = { store, index, listarPorEvento, cancelar };
