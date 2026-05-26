// src/services/ParticipanteService.js
const { Participante } = require("../models");
const { NotFoundError } = require("../errors/AppError");

async function listarTodos() {
  // Use Participante.findAll() com ordenação por nome
  // _________________________________
  const participantes = await Participante.findAll({
    order: [["nome", "ASC"]],
  });
  return participantes;
}

async function buscarPorId(id) {
  const participante = await Participante.findByPk(id);

  if (!participante) {
    throw new NotFoundError("Participante");
  }

  return participante;
}

async function criar(dados) {
  // Use Participante.create(dados) com try/catch para erros do Sequelize
  try {
    const novoParticipante = await Participante.create(dados);
    return novoParticipante;
  } catch (erro) {
    throw erro;
  }
}

async function atualizar(id, dados) {
  // TODO: próxima aula
}

async function deletar(id) {
  // TODO: próxima aula
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, deletar };
