// src/controllers/EventoController.js
const EventoService = require("../services/EventoService");
const cache = require("../config/cache");

async function index(req, res, next) {
  try {
    const resultado = await EventoService.listarTodos({
      pagina: req.query.pagina,
      porPagina: req.query.porPagina,
      ordenarPor: req.query.ordenarPor,
      ordem: req.query.ordem,
      busca: req.query.busca,
    });
    res.json(resultado);
  } catch (erro) {
    next(erro);
  }
}

async function listarFuturos(req, res, next) {
  try {
    const eventos = await EventoService.listarFuturos();
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
    cache.flushAll(); // Limpar cache após criar um novo evento
    res.status(201).json(novoEvento);
  } catch (erro) {
    next(erro);
  }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const eventoAtualizado = await EventoService.atualizar(id, req.body);
    cache.flushAll(); // Limpar cache após atualizar um evento
    res.json(eventoAtualizado);
  } catch (erro) {
    next(erro);
  }
}

async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await EventoService.deletar(id);
    cache.flushAll(); // Limpar cache após deletar um evento
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { index, show, store, update, destroy, listarFuturos };
