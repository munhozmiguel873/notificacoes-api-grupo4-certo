# Aula 23 — Templates de E-mail \+ Confirmação de Inscrição

**Bloco 4** · Terça-feira · Semana 12 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje vamos profissionalizar os e-mails da API criando **templates reutilizáveis**. Em vez de montar HTML direto no código, vamos ter templates separados que podem ser customizados facilmente.

**O que você vai produzir hoje:**

- [x] Criar um sistema de templates de e-mail  
- [x] Template de confirmação de inscrição (profissional)  
- [x] Template de cancelamento  
- [x] Refatorar o observer para usar os templates

---

## 🎨 Parte 1 — Sistema de Templates

### Organizando os templates

Crie a pasta e os arquivos:

mkdir \-p src/templates/email

### Template base (layout compartilhado)

// src/templates/email/baseTemplate.js

function baseTemplate(conteudo) {

  return \`

    \<\!DOCTYPE html\>

    \<html\>

    \<head\>

      \<meta charset="UTF-8"\>

      \<style\>

        body {

          font-family: Arial, sans-serif;

          background-color: \#f4f4f4;

          margin: 0;

          padding: 0;

        }

        .container {

          max-width: 600px;

          margin: 20px auto;

          background-color: \#ffffff;

          border-radius: 8px;

          overflow: hidden;

          box-shadow: 0 2px 8px rgba(0,0,0,0.1);

        }

        .header {

          background-color: \#2E75B6;

          color: white;

          padding: 20px;

          text-align: center;

        }

        .header h1 {

          margin: 0;

          font-size: 24px;

        }

        .body {

          padding: 30px;

          color: \#333333;

          line-height: 1.6;

        }

        .footer {

          background-color: \#f8f8f8;

          padding: 15px;

          text-align: center;

          font-size: 12px;

          color: \#888888;

          border-top: 1px solid \#eeeeee;

        }

        .btn {

          display: inline-block;

          background-color: \#2E75B6;

          color: white;

          padding: 12px 24px;

          text-decoration: none;

          border-radius: 4px;

          margin: 10px 0;

        }

        .info-box {

          background-color: \#f0f7ff;

          border-left: 4px solid \#2E75B6;

          padding: 15px;

          margin: 15px 0;

          border-radius: 0 4px 4px 0;

        }

      \</style\>

    \</head\>

    \<body\>

      \<div class="container"\>

        \<div class="header"\>

          \<h1\>Plataforma de Eventos\</h1\>

        \</div\>

        \<div class="body"\>

          ${conteudo}

        \</div\>

        \<div class="footer"\>

          \<p\>Este é um e-mail automático. Por favor, não responda.\</p\>

          \<p\>\&copy; 2025 Plataforma de Eventos — SENAI\</p\>

        \</div\>

      \</div\>

    \</body\>

    \</html\>

  \`;

}

module.exports \= baseTemplate;

### Template de confirmação de inscrição

// src/templates/email/confirmacaoInscricao.js

const baseTemplate \= require('./baseTemplate');

function confirmacaoInscricao(dados) {

  const { participanteNome, eventoNome, eventoData, eventoLocal } \= dados;

  const dataFormatada \= new Date(eventoData).toLocaleDateString('pt-BR', {

    weekday: 'long',

    year: 'numeric',

    month: 'long',

    day: 'numeric',

  });

  const conteudo \= \`

    \<h2\>Inscrição Confirmada\! ✅\</h2\>

    \<p\>Olá \<strong\>${participanteNome}\</strong\>,\</p\>

    \<p\>Sua inscrição foi confirmada com sucesso\!\</p\>

    \<div class="info-box"\>

      \<p\>\<strong\>Evento:\</strong\> ${eventoNome}\</p\>

      \<p\>\<strong\>Data:\</strong\> ${dataFormatada}\</p\>

      \<p\>\<strong\>Local:\</strong\> ${eventoLocal || 'A definir'}\</p\>

    \</div\>

    \<p\>Prepare-se para uma experiência incrível\! Se precisar cancelar sua inscrição,

    entre em contato com a organização.\</p\>

    \<p\>Até lá\! 🎉\</p\>

  \`;

  return baseTemplate(conteudo);

}

module.exports \= confirmacaoInscricao;

### Template de cancelamento

// src/templates/email/cancelamentoInscricao.js

const baseTemplate \= require('./baseTemplate');

function cancelamentoInscricao(dados) {

  const { participanteNome, eventoNome } \= dados;

  const conteudo \= \`

    \<h2\>Inscrição Cancelada\</h2\>

    \<p\>Olá \<strong\>${participanteNome}\</strong\>,\</p\>

    \<p\>Sua inscrição no evento \<strong\>"${eventoNome}"\</strong\> foi cancelada.\</p\>

    \<div class="info-box"\>

      \<p\>Se isso foi um engano, entre em contato com a organização

      para reativar sua inscrição.\</p\>

    \</div\>

    \<p\>Esperamos ver você em futuros eventos\!\</p\>

  \`;

  return baseTemplate(conteudo);

}

module.exports \= cancelamentoInscricao;

---

## ♻️ Parte 2 — Refatorando o Observer

Atualize o `notificacaoObserver.js` para usar os templates:

// src/events/notificacaoObserver.js

const appEmitter \= require('./eventEmitter');

const { Notificacao, Participante, Evento, Inscricao } \= require('../models');

const EmailService \= require('../services/EmailService');

const confirmacaoInscricao \= require('../templates/email/confirmacaoInscricao');

const cancelamentoInscricao \= require('../templates/email/cancelamentoInscricao');

// Helper para buscar dados completos da inscrição

async function buscarDadosInscricao(inscricaoId) {

  return await Inscricao.findByPk(inscricaoId, {

    include: \[

      { model: Evento, as: 'evento' },

      { model: Participante, as: 'participante' },

    \],

  });

}

// Helper para salvar notificação no banco

async function salvarNotificacao(dados) {

  return await Notificacao.create(dados);

}

// ── OBSERVER: Inscrição criada ──

appEmitter.on('inscricao:criada', async (inscricao) \=\> {

  try {

    const dados \= await buscarDadosInscricao(inscricao.id);

    if (\!dados) return;

    const { evento, participante } \= dados;

    const assunto \= \`Inscrição confirmada: ${evento.nome}\`;

    const html \= confirmacaoInscricao({

      participanteNome: participante.nome,

      eventoNome: evento.nome,

      eventoData: evento.data,

      eventoLocal: evento.local,

    });

    const resultado \= await EmailService.enviar(participante.email, assunto, html);

    await salvarNotificacao({

      inscricao\_id: inscricao.id,

      tipo: 'confirmacao',

      destinatario\_email: participante.email,

      assunto,

      conteudo: html,

      data\_envio: new Date(),

      enviada: true,

    });

    console.log(\`\[NOTIFICAÇÃO\] Confirmação enviada para ${participante.email}\`);

    console.log(\`   Visualizar em: ${resultado.visualizarEm}\`);

  } catch (erro) {

    console.error('\[NOTIFICAÇÃO\] Erro:', erro.message);

  }

});

// ── OBSERVER: Inscrição cancelada ──

appEmitter.on('inscricao:cancelada', async (inscricao) \=\> {

  try {

    const dados \= await buscarDadosInscricao(inscricao.id);

    if (\!dados) return;

    const { evento, participante } \= dados;

    const assunto \= \`Inscrição cancelada: ${evento.nome}\`;

    const html \= cancelamentoInscricao({

      participanteNome: participante.nome,

      eventoNome: evento.nome,

    });

    const resultado \= await EmailService.enviar(participante.email, assunto, html);

    await salvarNotificacao({

      inscricao\_id: inscricao.id,

      tipo: 'confirmacao',

      destinatario\_email: participante.email,

      assunto,

      conteudo: html,

      data\_envio: new Date(),

      enviada: true,

    });

    console.log(\`\[NOTIFICAÇÃO\] Cancelamento enviado para ${participante.email}\`);

    console.log(\`   Visualizar em: ${resultado.visualizarEm}\`);

  } catch (erro) {

    console.error('\[NOTIFICAÇÃO\] Erro:', erro.message);

  }

});

---

## 🧪 Parte 3 — Testando os Templates

1. **Criar inscrição:** `POST /inscricoes` → abra o MailPit → veja o e-mail bonito de confirmação  
2. **Cancelar inscrição:** `PATCH /inscricoes/1/cancelar` → abra o MailPit → veja o e-mail de cancelamento  
3. **Listar notificações:** `GET /notificacoes` → ambas devem aparecer com `enviada: true`

Compare o visual do e-mail com o HTML inline que tínhamos antes — a diferença é enorme\!

---

## 🧩 Desafio — Template de Lembrete

Crie um template `src/templates/email/lembreteEvento.js` que avisa o participante que o evento está chegando:

// Template com lacunas para completar:

const baseTemplate \= require('./baseTemplate');

function lembreteEvento(dados) {

  const { participanteNome, eventoNome, eventoData, eventoLocal } \= dados;

  // Calcular quantos dias faltam

  const hoje \= new Date();

  const dataEvento \= new Date(eventoData);

  const diffMs \= dataEvento \- hoje;

  const diasFaltando \= Math.ceil(diffMs / (1000 \* 60 \* 60 \* 24));

  const conteudo \= \`

    \<h2\>Lembrete: Evento se aproxima\! ⏰\</h2\>

    \<p\>Olá \<strong\>${participanteNome}\</strong\>,\</p\>

    \<\!-- Complete: monte a mensagem informando quantos dias faltam \--\>

    \<\!-- Use a variável diasFaltando \--\>

    \<\!-- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \--\>

    \<\!-- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \--\>

    \<\!-- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \--\>

  \`;

  return baseTemplate(conteudo);

}

module.exports \= lembreteEvento;

💡 Não precisa implementar o envio automático de lembretes agora — isso envolveria cron jobs (tarefas agendadas), que é um conceito avançado. O template pronto já é a entrega.

---

## ✅ Checklist — Antes de Sair

- [ ] Base template criado com layout profissional (header, body, footer)  
- [ ] Template de confirmação de inscrição funcionando  
- [ ] Template de cancelamento funcionando  
- [ ] Observer refatorado para usar templates  
- [ ] E-mails bonitos visíveis no MailPit  
- [ ] Notificações salvas no banco com HTML completo  
- [ ] Template de lembrete criado (desafio)  
- [ ] Commit e push

---

**Próxima aula:** Regras de negócio — tipos de notificação, histórico de envios e lógica avançada.  
