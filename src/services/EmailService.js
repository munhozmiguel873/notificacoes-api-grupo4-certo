// src/services/EmailService.js
const nodemailer = require("nodemailer");

let transporter = null;

// IP do servidor MailPit (professor informa)
const MAILPIT_HOST = process.env.SMTP_HOST;
const MAILPIT_PORT = process.env.SMTP_PORT;

async function inicializar() {
  transporter = nodemailer.createTransport({
    host: MAILPIT_HOST,
    port: MAILPIT_PORT,
    secure: false,
    tls: { rejectUnauthorized: false },
  });

  // Testar conexão
  try {
    await transporter.verify();
    console.log("═══════════════════════════════════════════");
    console.log("📧 Servidor de e-mail conectado!");
    console.log(`   MailPit: http://${MAILPIT_HOST}:8025`);
    console.log("═══════════════════════════════════════════");
  } catch (erro) {
    console.error("⚠️ Servidor de e-mail indisponível:", erro.message);
    console.error("   Os e-mails não serão enviados.");
  }
}

async function enviar(para, assunto, html) {
  if (!transporter) {
    throw new Error("EmailService não inicializado.");
  }

  const info = await transporter.sendMail({
    from: '"Plataforma de Eventos" <eventos@notificacoes.com>',
    to: para,
    subject: assunto,
    html: html,
  });

  console.log(`📧 E-mail enviado para ${para} (ID: ${info.messageId})`);
  console.log(`   Visualizar em: http://${MAILPIT_HOST}:8025`);

  return {
    messageId: info.messageId,
    previewUrl: `http://${MAILPIT_HOST}:8025`,
  };
}

module.exports = { inicializar, enviar };
