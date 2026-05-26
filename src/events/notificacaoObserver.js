// src/events/notificacaoObserver.js
const appEmitter = require("./eventEmitter");
const { Notificacao, Participante, Evento, Inscricao } = require("../models");

const EmailService = require("../services/EmailService");
const confirmacaoInscricao = require("../templates/email/confirmacaoInscricao");
const cancelamentoInscricao = require("../templates/email/cancelamentoInscricao");

// Helper para buscar dados completos da inscrição
async function buscarDadosInscricao(inscricaoId) {
  return await Inscricao.findByPk(inscricaoId, {
    include: [
      { model: Evento, as: "evento" },
      { model: Participante, as: "participante" },
    ],
  });
}

// Helper para salvar notificação no banco
async function salvarNotificacao(dados) {
  return await Notificacao.create(dados);
}

// ── OBSERVER: Inscrição criada ──
appEmitter.on("inscricao:criada", async (inscricao) => {
  try {
    const dados = await buscarDadosInscricao(inscricao.id);
    if (!dados) return;

    const { evento, participante } = dados;
    const assunto = `Inscrição confirmada: ${evento.nome}`;
    const html = confirmacaoInscricao({
      participanteNome: participante.nome,
      eventoNome: evento.nome,
      eventoData: evento.data,
      eventoLocal: evento.local,
    });

    const resultado = await EmailService.enviar(
      participante.email,
      assunto,
      html,
    );

    await salvarNotificacao({
      inscricao_id: inscricao.id,
      tipo: "confirmacao",
      destinatario_email: participante.email,
      assunto,
      conteudo: html,
      data_envio: new Date(),
      enviada: true,
    });

    console.log(`[NOTIFICAÇÃO] Confirmação enviada para ${participante.email}`);
    console.log(`   Visualizar em: ${resultado.visualizarEm}`);
  } catch (erro) {
    console.error("[NOTIFICAÇÃO] Erro:", erro.message);
  }
});

// ── OBSERVER: Inscrição cancelada ──
appEmitter.on("inscricao:cancelada", async (inscricao) => {
  try {
    const dados = await buscarDadosInscricao(inscricao.id);
    if (!dados) return;

    const { evento, participante } = dados;
    const assunto = `Inscrição cancelada: ${evento.nome}`;
    const html = cancelamentoInscricao({
      participanteNome: participante.nome,
      eventoNome: evento.nome,
    });

    const resultado = await EmailService.enviar(
      participante.email,
      assunto,
      html,
    );

    await salvarNotificacao({
      inscricao_id: inscricao.id,
      tipo: "confirmacao",
      destinatario_email: participante.email,
      assunto,
      conteudo: html,
      data_envio: new Date(),
      enviada: true,
    });

    console.log(
      `[NOTIFICAÇÃO] Cancelamento enviado para ${participante.email}`,
    );
    console.log(`   Visualizar em: ${resultado.visualizarEm}`);
  } catch (erro) {
    console.error("[NOTIFICAÇÃO] Erro:", erro.message);
  }
});
