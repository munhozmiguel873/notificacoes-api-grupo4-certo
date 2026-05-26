# Aula 22 — Nodemailer: Enviando E-mails com Ethereal

> **Bloco 4** · Quinta-feira · Semana 11 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Hoje vamos fazer algo que impressiona: **enviar e-mails de verdade** (simulados) a partir da nossa API! Vamos usar o **Nodemailer** com o **Ethereal** — um serviço que cria caixas de e-mail de teste automaticamente. Vocês vão ver o e-mail chegando num navegador!

**O que você vai produzir hoje:**
- [x] Instalar e configurar o Nodemailer
- [x] Criar conta de teste no Ethereal automaticamente
- [x] Criar o EmailService
- [x] Enviar o primeiro e-mail e visualizar no navegador

---

## 📧 O Que é o Nodemailer?

O **Nodemailer** é a biblioteca mais popular do Node.js para enviar e-mails. Ele funciona com qualquer servidor SMTP (Gmail, Outlook, SendGrid, etc.).

Para desenvolvimento, vamos usar o **Ethereal** — um serviço criado pela própria equipe do Nodemailer que:
- Cria uma conta de e-mail de teste **automaticamente** (sem cadastro!)
- Captura os e-mails enviados (eles não chegam de verdade no destinatário)
- Permite visualizar os e-mails num painel web
- É **gratuito** e perfeito para aprender

> 💡 É como um "Mailtrap" embutido no Nodemailer — zero configuração.

---

## 🛠️ Parte 1 — Instalação e Configuração

### Instalar o Nodemailer

```bash
npm install nodemailer
```

### Criar o EmailService

Crie `src/services/EmailService.js`:

```javascript
// src/services/EmailService.js
const nodemailer = require('nodemailer');

let transporter = null;
let contaTeste = null;

/**
 * Inicializa o transporter com uma conta de teste do Ethereal.
 * Chamado uma vez ao iniciar o servidor.
 */
async function inicializar() {
  // Criar conta de teste automaticamente
  contaTeste = await nodemailer.createTestAccount();

  console.log('═══════════════════════════════════════════');
  console.log('📧 E-mail de teste configurado!');
  console.log(`   Usuário: ${contaTeste.user}`);
  console.log(`   Senha:   ${contaTeste.pass}`);
  console.log(`   Painel:  https://ethereal.email/login`);
  console.log('═══════════════════════════════════════════');

  // Criar o transporter (o "carteiro" que envia os e-mails)
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: contaTeste.user,
      pass: contaTeste.pass,
    },
  });
}

/**
 * Envia um e-mail.
 * @param {string} para - E-mail do destinatário
 * @param {string} assunto - Assunto do e-mail
 * @param {string} html - Conteúdo HTML do e-mail
 * @returns {object} Informações do envio, incluindo URL de preview
 */
async function enviar(para, assunto, html) {
  if (!transporter) {
    throw new Error('EmailService não inicializado. Chame inicializar() primeiro.');
  }

  const info = await transporter.sendMail({
    from: '"Plataforma de Eventos" <eventos@notificacoes.com>',
    to: para,
    subject: assunto,
    html: html,
  });

  // O Ethereal gera uma URL para visualizar o e-mail enviado!
  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log(`📧 E-mail enviado para ${para}`);
  console.log(`   Preview: ${previewUrl}`);

  return {
    messageId: info.messageId,
    previewUrl: previewUrl,
  };
}

module.exports = {
  inicializar,
  enviar,
};
```

### Inicializar ao subir o servidor

Atualize o `src/server.js`:

```javascript
require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const EmailService = require('./services/EmailService');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com MySQL estabelecida com sucesso!');

    // Inicializar o serviço de e-mail
    await EmailService.inicializar();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (erro) {
    console.error('Erro ao iniciar:', erro.message);
    process.exit(1);
  }
}

iniciar();
```

### Teste rápido

Rode `npm run dev`. Você deve ver no terminal:

```
═══════════════════════════════════════════
📧 E-mail de teste configurado!
   Usuário: abc123@ethereal.email
   Senha:   xyz789
   Painel:  https://ethereal.email/login
═══════════════════════════════════════════
```

---

## 📬 Parte 2 — Rota de Teste de E-mail

Antes de integrar com as notificações, vamos criar uma rota de teste para ver o e-mail funcionando:

Adicione em `src/routes/notificacaoRoutes.js`:

```javascript
const EmailService = require('../services/EmailService');

// POST /notificacoes/teste-email — enviar e-mail de teste
router.post('/teste-email', async (req, res, next) => {
  try {
    const resultado = await EmailService.enviar(
      'teste@exemplo.com',
      'Teste da API de Notificações',
      '<h1>Funcionou! 🎉</h1><p>Este e-mail foi enviado pela nossa API.</p>'
    );

    res.json({
      mensagem: 'E-mail de teste enviado!',
      previewUrl: resultado.previewUrl,
    });
  } catch (erro) {
    next(erro);
  }
});
```

### Teste no Postman

```
POST http://localhost:3000/notificacoes/teste-email
```

Resposta:

```json
{
  "mensagem": "E-mail de teste enviado!",
  "previewUrl": "https://ethereal.email/message/abc123..."
}
```

**Abra o `previewUrl` no navegador** — você verá o e-mail renderizado, exatamente como o destinatário veria!

> ✅ Se você viu o e-mail no Ethereal, o Nodemailer está funcionando!

---

## 🔗 Parte 3 — Integrando com o Observer

Agora vamos fazer o observer de notificações **enviar o e-mail de verdade** (via Ethereal). Atualize o `notificacaoObserver.js`:

```javascript
// src/events/notificacaoObserver.js
const appEmitter = require('./eventEmitter');
const { Notificacao, Participante, Evento, Inscricao } = require('../models');
const EmailService = require('../services/EmailService');

appEmitter.on('inscricao:criada', async (inscricao) => {
  try {
    console.log(`[OBSERVER] Nova inscrição detectada: #${inscricao.id}`);

    const inscricaoCompleta = await Inscricao.findByPk(inscricao.id, {
      include: [
        { model: Evento, as: 'evento' },
        { model: Participante, as: 'participante' },
      ],
    });

    if (!inscricaoCompleta) return;

    const { evento, participante } = inscricaoCompleta;

    // Montar o HTML do e-mail
    const html = `
      <h2>Inscrição Confirmada! ✅</h2>
      <p>Olá <strong>${participante.nome}</strong>,</p>
      <p>Sua inscrição no evento <strong>"${evento.nome}"</strong> foi confirmada com sucesso.</p>
      <p><strong>Detalhes do evento:</strong></p>
      <ul>
        <li><strong>Data:</strong> ${new Date(evento.data).toLocaleDateString('pt-BR')}</li>
        <li><strong>Local:</strong> ${evento.local || 'A definir'}</li>
      </ul>
      <p>Até lá! 🎉</p>
      <hr>
      <small>Este é um e-mail automático da Plataforma de Eventos.</small>
    `;

    // Enviar o e-mail
    const resultado = await EmailService.enviar(
      participante.email,
      `Inscrição confirmada: ${evento.nome}`,
      html
    );

    // Salvar a notificação no banco com status "enviada"
    await Notificacao.create({
      inscricao_id: inscricao.id,
      tipo: 'confirmacao',
      destinatario_email: participante.email,
      assunto: `Inscrição confirmada: ${evento.nome}`,
      conteudo: html,
      data_envio: new Date(),
      enviada: true,
    });

    console.log(`[OBSERVER] E-mail enviado! Preview: ${resultado.previewUrl}`);
  } catch (erro) {
    console.error('[OBSERVER] Erro ao enviar notificação:', erro.message);
  }
});
```

### Teste completo

1. `POST /inscricoes` com `{ "eventoId": 1, "participanteId": 1 }`
2. No terminal, veja o log com a URL de preview
3. Abra a URL no navegador — o e-mail de confirmação está lá!
4. `GET /notificacoes` — a notificação aparece com `enviada: true`

> 🎉 **Momento mágico!** Os alunos criam uma inscrição e veem o e-mail chegando em tempo real.

---

## 🧩 Desafio

Crie um e-mail de **boas-vindas** que é enviado quando um novo participante se cadastra:

1. Emita `participante:criado` no `ParticipanteService.criar()`
2. Crie um observer que escuta esse evento
3. Envie um e-mail simples: "Bem-vindo à Plataforma de Eventos, [nome]!"

---

## ✅ Checklist — Antes de Sair

- [x] Nodemailer instalado
- [x] EmailService criado com Ethereal (conta de teste automática)
- [ ] Rota POST /notificacoes/teste-email funcionando
- [ ] E-mail visualizado no painel do Ethereal
- [ ] Observer atualizado para enviar e-mail real ao criar inscrição
- [ ] Notificação salva no banco com `enviada: true`
- [ ] Commit e push

---

> **Próxima aula:** Templates de e-mail profissionais e envio de lembretes.
