
# 🔔 Notification API

API REST desenvolvida para gerenciamento e envio de notificações relacionadas a eventos. O sistema permite cadastrar eventos, registrar usuários e disparar notificações automaticamente quando determinadas ações ocorrem.

## 📌 Funcionalidades

- ✅ Cadastro de eventos
- ✅ Listagem de eventos
- ✅ Atualização e remoção de eventos
- ✅ Cadastro de usuários
- ✅ Associação de usuários a eventos
- ✅ Envio automático de notificações
- ✅ Histórico de notificações enviadas
- ✅ Tratamento de erros e validações

## 🛠️ Tecnologias Utilizadas

- JavaScript
- Swagger
- MySQL 
- Postman
- Node.js 
- Sequelize  
- Nodemailer + MailPit
- Express.js 
- MariaDB


## 📂 Estrutura do Projeto

```text
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

```

## ⚙️ Configuração do Ambiente

### Clone o repositório

```bash
git clone https://github.com/munhozmiguel873/notificacoes-api-grupo4-certo.git
```

### Acesse a pasta do projeto

```bash
cd notification-api
```

### A API estará disponível em:

```text
http://localhost:3000
```

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

## 📝 Exemplo de Requisição

```json
POST /localhost:3000/eventos

{
"nome": "Curso intensivo de Back-End",
"descricao": "Curso para quem quer aprender tudo sobre back-end.",
"data": "2026-10-10",
"local": "SENAI - Sala 5",
"capacidade": 150
}
```

## 👥 Equipe

* Miguel MUnhoz N°24
* Pedro Augusto N°25
* Pietro Dipiassa N°27

## 📄 Licença
Projeto acadêmico — SENAI 2026

