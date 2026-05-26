# Aula 22 — Nodemailer: Enviando E-mails com MailPit

**Bloco 4** · Quinta-feira · Semana 11 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Hoje vamos fazer algo que impressiona: **enviar e-mails de verdade** (simulados) a partir da nossa API\! Vamos usar o **Nodemailer** com o **MailPit** — um servidor de e-mail de teste que roda na rede da sala. Vocês vão ver o e-mail chegando num painel web\!

**O que você vai produzir hoje:**

- [x] Instalar e configurar o Nodemailer  
- [x] Conectar ao servidor MailPit da sala  
- [x] Criar o EmailService  
- [x] Enviar o primeiro e-mail e visualizar no navegador

---

## 📧 O Que É o Nodemailer?

O **Nodemailer** é a biblioteca mais popular do Node.js para enviar e-mails. Ele funciona com qualquer servidor SMTP (Gmail, Outlook, SendGrid, etc.).

Para desenvolvimento, vamos usar o **MailPit** — um servidor SMTP de teste que o professor configurou no servidor da sala. Ele:

- **Captura** todos os e-mails enviados (eles não chegam de verdade no destinatário)  
- Permite **visualizar** os e-mails numa interface web moderna  
- Roda na **rede local** — sem depender de internet  
- É **gratuito** e open-source

💡 No mercado, ambientes de desenvolvimento usam servidores SMTP internos exatamente assim. Vocês estão aprendendo a forma profissional de testar e-mails.

---

## 🖥️ O MailPit da Sala

O professor configurou o MailPit no servidor Proxmox. Vocês têm acesso a:

| Serviço | Endereço | Porta |
| :---- | :---- | :---- |
| **SMTP** (para onde o Nodemailer envia) | `MAILPIT_IP` | `1025` |
| **Web UI** (para visualizar os e-mails) | `http://MAILPIT_IP:8025` | `8025` |

📌 O professor vai informar o IP real. Substitua `MAILPIT_IP` pelo IP fornecido.

**Teste agora:** abra `http://MAILPIT_IP:8025` no navegador. Você deve ver a interface do MailPit com uma caixa de entrada (provavelmente vazia por enquanto).

---

## 🛠️ Parte 1 — Instalação e Configuração

### Instalar o Nodemailer

npm install nodemailer

### Criar o EmailService

Crie `src/services/EmailService.js`:

// src/services/EmailService.js

const nodemailer \= require('nodemailer');

let transporter \= null;

// Endereço do MailPit (configurado via .env)

const SMTP\_HOST \= process.env.SMTP\_HOST || 'MAILPIT\_IP';

const SMTP\_PORT \= process.env.SMTP\_PORT || 1025;

const MAILPIT\_URL \= \`http://${SMTP\_HOST}:8025\`;

/\*\*

 \* Inicializa o transporter conectando ao MailPit.

 \* Chamado uma vez ao iniciar o servidor.

 \*/

async function inicializar() {

  transporter \= nodemailer.createTransport({

    host: SMTP\_HOST,

    port: parseInt(SMTP\_PORT),

    secure: false,

    tls: { rejectUnauthorized: false },

  });

  // Testar a conexão com o MailPit

  try {

    await transporter.verify();

    console.log('═══════════════════════════════════════════');

    console.log('📧 Servidor de e-mail conectado\!');

    console.log(\`   SMTP: ${SMTP\_HOST}:${SMTP\_PORT}\`);

    console.log(\`   Painel: ${MAILPIT\_URL}\`);

    console.log('═══════════════════════════════════════════');

  } catch (erro) {

    console.error('⚠️ Servidor de e-mail indisponível:', erro.message);

    console.error('   Verifique se o MailPit está rodando e o IP está correto.');

  }

}

/\*\*

 \* Envia um e-mail.

 \* @param {string} para \- E-mail do destinatário

 \* @param {string} assunto \- Assunto do e-mail

 \* @param {string} html \- Conteúdo HTML do e-mail

 \* @returns {object} Informações do envio

 \*/

async function enviar(para, assunto, html) {

  if (\!transporter) {

    throw new Error('EmailService não inicializado. Chame inicializar() primeiro.');

  }

  const info \= await transporter.sendMail({

    from: '"Plataforma de Eventos" \<eventos@notificacoes.com\>',

    to: para,

    subject: assunto,

    html: html,

  });

  console.log(\`📧 E-mail enviado para ${para} (ID: ${info.messageId})\`);

  console.log(\`   Visualizar em: ${MAILPIT\_URL}\`);

  return {

    messageId: info.messageId,

    visualizarEm: MAILPIT\_URL,

  };

}

module.exports \= {

  inicializar,

  enviar,

};

### Entendendo o código

| Parte | O que faz |
| :---- | :---- |
| `createTransport({...})` | Cria o "carteiro" que vai enviar os e-mails |
| `host` e `port` | Endereço do MailPit na rede da sala |
| `secure: false` | O MailPit usa conexão simples (sem SSL) |
| `transporter.verify()` | Testa se a conexão com o MailPit funciona |
| `transporter.sendMail({...})` | Envia o e-mail (capturado pelo MailPit) |

### Configurar as variáveis de ambiente

Adicione ao `.env`:

\# Servidor de e-mail (MailPit)

SMTP\_HOST=MAILPIT\_IP

SMTP\_PORT=1025

E atualize o `.env.example`:

\# Servidor de e-mail (MailPit da sala)

SMTP\_HOST=MAILPIT\_IP

SMTP\_PORT=1025

📌 Substitua `MAILPIT_IP` pelo IP real que o professor informou.

### Inicializar ao subir o servidor

Atualize o `src/server.js`:

require('dotenv').config();

const app \= require('./app');

const { sequelize } \= require('./models');

const EmailService \= require('./services/EmailService');

const PORT \= process.env.PORT || 3000;

async function iniciar() {

  try {

    await sequelize.authenticate();

    console.log('Conexão com MySQL estabelecida com sucesso\!');

    // Inicializar o serviço de e-mail

    await EmailService.inicializar();

    app.listen(PORT, () \=\> {

      console.log(\`Servidor rodando em http://localhost:${PORT}\`);

      console.log(\`Documentação: http://localhost:${PORT}/api-docs\`);

    });

  } catch (erro) {

    console.error('Erro ao iniciar:', erro.message);

    process.exit(1);

  }

}

iniciar();

### Teste rápido

Rode `npm run dev`. Você deve ver no terminal:

═══════════════════════════════════════════

📧 Servidor de e-mail conectado\!

   SMTP: 192.168.x.200:1025

   Painel: http://192.168.x.200:8025

═══════════════════════════════════════════

---

## 📬 Parte 2 — Rota de Teste de E-mail

Antes de integrar com as notificações, vamos criar uma rota de teste para ver o e-mail funcionando:

Adicione em `src/routes/notificacaoRoutes.js`:

const EmailService \= require('../services/EmailService');

// POST /notificacoes/teste-email — enviar e-mail de teste

router.post('/teste-email', async (req, res, next) \=\> {

  try {

    const resultado \= await EmailService.enviar(

      'teste@exemplo.com',

      'Teste da API de Notificações',

      '\<h1\>Funcionou\! 🎉\</h1\>\<p\>Este e-mail foi enviado pela nossa API.\</p\>'

    );

    res.json({

      mensagem: 'E-mail de teste enviado\!',

      visualizarEm: resultado.visualizarEm,

    });

  } catch (erro) {

    next(erro);

  }

});

### Teste no Postman

POST http://localhost:3000/notificacoes/teste-email

Resposta:

{

  "mensagem": "E-mail de teste enviado\!",

  "visualizarEm": "http://192.168.x.200:8025"

}

**Agora abra `http://MAILPIT_IP:8025` no navegador** — o e-mail apareceu na caixa de entrada\! Clique nele para ver o conteúdo renderizado.

✅ Se você viu o e-mail no MailPit, o Nodemailer está funcionando\!

💡 **Todos os grupos compartilham o mesmo MailPit** — vocês vão ver os e-mails de todos os grupos na mesma caixa. Isso é normal e divertido\! No mercado, equipes compartilham ambientes de teste da mesma forma.

---

## 🔗 Parte 3 — Integrando com o Observer

Agora vamos fazer o observer de notificações **enviar o e-mail de verdade** (via MailPit). Atualize o `notificacaoObserver.js`:

// src/events/notificacaoObserver.js

const appEmitter \= require('./eventEmitter');

const { Notificacao, Participante, Evento, Inscricao } \= require('../models');

const EmailService \= require('../services/EmailService');

appEmitter.on('inscricao:criada', async (inscricao) \=\> {

  try {

    console.log(\`\[OBSERVER\] Nova inscrição detectada: \#${inscricao.id}\`);

    const inscricaoCompleta \= await Inscricao.findByPk(inscricao.id, {

      include: \[

        { model: Evento, as: 'evento' },

        { model: Participante, as: 'participante' },

      \],

    });

    if (\!inscricaoCompleta) return;

    const { evento, participante } \= inscricaoCompleta;

    // Montar o HTML do e-mail

    const html \= \`

      \<h2\>Inscrição Confirmada\! ✅\</h2\>

      \<p\>Olá \<strong\>${participante.nome}\</strong\>,\</p\>

      \<p\>Sua inscrição no evento \<strong\>"${evento.nome}"\</strong\> foi confirmada com sucesso.\</p\>

      \<p\>\<strong\>Detalhes do evento:\</strong\>\</p\>

      \<ul\>

        \<li\>\<strong\>Data:\</strong\> ${new Date(evento.data).toLocaleDateString('pt-BR')}\</li\>

        \<li\>\<strong\>Local:\</strong\> ${evento.local || 'A definir'}\</li\>

      \</ul\>

      \<p\>Até lá\! 🎉\</p\>

      \<hr\>

      \<small\>Este é um e-mail automático da Plataforma de Eventos.\</small\>

    \`;

    // Enviar o e-mail via MailPit

    await EmailService.enviar(

      participante.email,

      \`Inscrição confirmada: ${evento.nome}\`,

      html

    );

    // Salvar a notificação no banco com status "enviada"

    await Notificacao.create({

      inscricao\_id: inscricao.id,

      tipo: 'confirmacao',

      destinatario\_email: participante.email,

      assunto: \`Inscrição confirmada: ${evento.nome}\`,

      conteudo: html,

      data\_envio: new Date(),

      enviada: true,

    });

    console.log(\`\[NOTIFICAÇÃO\] Confirmação enviada para ${participante.email}\`);

  } catch (erro) {

    console.error('\[NOTIFICAÇÃO\] Erro ao enviar:', erro.message);

  }

});

### Teste completo

1. `POST /inscricoes` com `{ "eventoId": 1, "participanteId": 1 }`  
2. No terminal, veja o log de envio  
3. Abra `http://MAILPIT_IP:8025` — o e-mail de confirmação está lá\!  
4. `GET /notificacoes` — a notificação aparece com `enviada: true`

🎉 **Momento mágico\!** Os alunos criam uma inscrição e veem o e-mail chegando no MailPit em tempo real.

---

## 🧩 Desafio

Crie um e-mail de **boas-vindas** que é enviado quando um novo participante se cadastra:

1. Emita `participante:criado` no `ParticipanteService.criar()`  
2. Crie um observer que escuta esse evento  
3. Envie um e-mail simples: "Bem-vindo à Plataforma de Eventos, \[nome\]\!"  
4. Confira no MailPit se chegou

---

## ✅ Checklist — Antes de Sair

- [ ] Nodemailer instalado  
- [ ] EmailService criado e conectado ao MailPit  
- [ ] Variáveis SMTP\_HOST e SMTP\_PORT no `.env`  
- [ ] Rota POST /notificacoes/teste-email funcionando  
- [ ] E-mail visualizado no painel do MailPit  
- [ ] Observer atualizado para enviar e-mail real ao criar inscrição  
- [ ] Notificação salva no banco com `enviada: true`  
- [ ] Commit e push

---

**Próxima aula:** Templates de e-mail profissionais e envio de notificações de cancelamento.  
