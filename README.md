# 🔔 Notificações API

API REST para módulo de notificações por e-mail de uma plataforma de eventos.

![Node.js](https://img.shields.io/badge/Node.js-24+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MariaDB](https://img.shields.io/badge/MariaDB-11.x-blue)
![Deploy](https://img.shields.io/badge/Deploy-Servidor%20SENAI-blueviolet)

**🌐 URL de Produção:** [10.137.146.204]
**📚 Documentação:** [10.137.146.204]/api-docs

---

## 📋 Sobre o Projeto

Sistema de notificações por e-mail para uma plataforma de eventos.
Quando um participante se inscreve em um evento, recebe automaticamente
um e-mail de confirmação. O sistema também envia notificações de cancelamento.

**Desenvolvido como projeto da SA2** — SENAI "Santo Paschoal Crepaldi"
Curso: Técnico em Desenvolvimento de Sistemas
UCs: Programação Back-End + Projetos de Software

### Equipe

- [ Miguel Munhoz ] — [GitHub](https://github.com/munhozmiguel873)
- [ Pedro Augusto ] — [GitHub](https://github.com/Pedro-Augusto27)
- [ Pietro Dipiassa ] — [GitHub](https://github.com/Dipiassa09)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 24+
- MySQL 8.0 ou MariaDB 11+
- Git

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/munhozmiguel873/notificacoes-api-grupo4-certo
   cd notificacoes-api-grupo4
   ```
---

## 📚 Rotas da API

### Eventos

- GET eventos
- GET evento by id
- POST evento
- PUT evento
- DELETE evento
- POST evento banner

### Participantes

- GET participantes
- GET participante by id
- POST participante
- PUT participante
- DELETE participante

### Inscrições

- GET inscrição
- GET inscrição by id
- POST inscrição
- PUT inscrição
- DELETE inscrição

### Notificações

- GET notificação
- GET notificação by id
- GET notificação estatistica
- POST notificação reenviar
- POST notificação test

### Exportação

- GET exportar xml
- GET exportar JSON
- GET exportar relatorio

---

## 🛠️ Tecnologias

| Tecnologia           | Finalidade                     |
| -------------------- | ------------------------------ |
| Node.js              | Runtime                        |
| Express.js           | Framework web                  |
| MariaDB              | Banco de dados                 |
| Sequelize            | ORM                            |
| Nodemailer + MailPit | Envio de e-mails (teste local) |
| Swagger              | Documentação                   |
| Multer               | Upload de arquivos             |

---

## 📁 Estrutura do Projeto

notificacoes-api-grupo4-certo/
├── docs/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── errors/
│   │   └── AppError.js
│   ├── events/
│   │   ├── eventEmitter.js
│   │   ├── logObserver.js
│   │   └── notificacaoObserver.js
│   ├── helpers/
│   │   ├── parseId.js
│   │   └── validators.js
│   ├── logs/
│   │   └── app.log
│   ├── middlewares/
│   │   ├── cacheMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── notFound.js
│   │   └── responseTime.js
│   ├── models/
│   │   ├── EventoModel.js
│   │   ├── index.js
│   │   ├── InscricaoModel.js
│   │   ├── NotificacaoModel.js
│   │   └── ParticipanteModel.js
│   ├── routes/
│   │   ├── eventoRoutes.js
│   │   ├── exportRoutes.js
│   │   ├── inscricaoRoutes.js
│   │   ├── notificacaoRoutes.js
│   │   └── participanteRoutes.js
│   ├── services/
│   │   ├── EmailService.js
│   │   ├── EventoService.js
│   │   ├── InscricaoService.js
│   │   ├── NotificacaoService.js
│   │   └── ParticipanteService.js
│   ├── templates/
│   │   └── email/
│   │       ├── baseTemplate.js
│   │       ├── cancelamentoInscricao.js
│   │       └── confirmacaoInscricao.js
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── swagger.js
├── .env.example
├── .gitignore
├── .sequelizerc
├── package-lock.json
├── package.json
├── README.md
└── RELATORIO-CORRECOES.md

---

## 🔧 Scripts Disponíveis

| Comando              | Descrição             |
| -------------------- | --------------------- |
| `npm start`          | Inicia em produção    |
| `npm run dev`        | Inicia com Nodemon    |
| `npm run db:migrate` | Executa migrations    |
| `npm run db:seed`    | Insere dados iniciais |
| `npm run db:reset`   | Recria banco completo |

---

## 📧 Sistema de Notificações

A API usa o **Padrão Observer** para disparar notificações automaticamente:

- ✅ Confirmação de inscrição
- ✅ Cancelamento de inscrição

Em desenvolvimento, e-mails são capturados pelo MailPit (servidor SMTP local na rede da sala).

---
## 📄 Licença

Projeto acadêmico — SENAI 2026