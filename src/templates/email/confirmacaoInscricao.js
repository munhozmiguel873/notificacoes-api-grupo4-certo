const baseTemplate = require("./baseTemplate");

function confirmacaoInscricao(dados) {
  const { participanteNome, eventoNome, eventoData, eventoLocal } = dados;

  const dataFormatada = new Date(eventoData).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const conteudo = `
    <h2>Inscrição Confirmada! ✅</h2>
    <p>Olá <strong>${participanteNome}</strong>,</p>
    <p>Sua inscrição foi confirmada com sucesso!</p>
    <p>e-mail enviado pelo Wagner</p>

    <div class="info-box">
      <p><strong>Evento:</strong> ${eventoNome}</p>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Local:</strong> ${eventoLocal || "A definir"}</p>
    </div>

    <p>Prepare-se para uma experiência incrível! Se precisar cancelar sua inscrição,
    entre em contato com a organização.</p>

    <p>Até lá! 🎉</p>
  `;

  return baseTemplate(conteudo);
}

module.exports = confirmacaoInscricao;
