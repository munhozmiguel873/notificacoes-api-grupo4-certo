const baseTemplate = require("./baseTemplate");

function cancelamentoInscricao(dados) {
  const { participanteNome, eventoNome } = dados;

  const conteudo = `
    <h2>Inscrição Cancelada</h2>
    <p>Olá <strong>${participanteNome}</strong>,</p>
    <p>Sua inscrição no evento <strong>"${eventoNome}"</strong> foi cancelada.</p>
    <p>e-mail enviado pelo Wagner</p>

    <div class="info-box">
      <p>Se isso foi um engano, entre em contato com a organização
      para reativar sua inscrição.</p>
    </div>

    <p>Esperamos ver você em futuros eventos!</p>
  `;

  return baseTemplate(conteudo);
}

module.exports = cancelamentoInscricao;
