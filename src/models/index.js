// src/models/index.js
const sequelize = require("../config/database");
const Evento = require("./EventoModel");
const Participante = require("./ParticipanteModel");
const Inscricao = require("./InscricaoModel");
const Notificacao = require("./NotificacaoModel");

// ── Relacionamentos ──

// Um Evento tem muitas Inscrições
Evento.hasMany(Inscricao, { foreignKey: "evento_id", as: "inscricoes" });
Inscricao.belongsTo(Evento, { foreignKey: "evento_id", as: "evento" });

// Um Participante tem muitas Inscrições
Participante.hasMany(Inscricao, {
  foreignKey: "participante_id",
  as: "inscricoes",
});
Inscricao.belongsTo(Participante, {
  foreignKey: "participante_id",
  as: "participante",
});

// Uma Inscrição tem muitas Notificações
Inscricao.hasMany(Notificacao, {
  foreignKey: "inscricao_id",
  as: "notificacoes",
});
Notificacao.belongsTo(Inscricao, {
  foreignKey: "inscricao_id",
  as: "inscricao",
});

module.exports = {
  sequelize,
  Evento,
  Participante,
  Inscricao,
  Notificacao,
};
