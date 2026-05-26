# Documentação de Arquitetura — API de Notificações

## 1. Visão Geral

A API de Notificações é um módulo back-end REST responsável pelo gerenciamento de notificações relacionadas a eventos. O sistema permite o cadastro de eventos, participantes e inscrições, além da organização das informações necessárias para futuros envios de notificações por e-mail.

---

## 2. Arquitetura de Software

```text
Cliente (Postman/Navegador)
        │
        ▼
[ Middleware Express ]
(express.json + tratamento de erros)
        │
        ▼
[ Routes ]
Define endpoints HTTP e direciona requisições
        │
        ▼
[ Controllers ]
Recebe requests, valida parâmetros e retorna respostas HTTP
        │
        ▼
[ Models em memória ]
Dados armazenados temporariamente em arrays no servidor
```

### 📌 Observações

* O projeto utiliza arquitetura baseada em MVC.
* Atualmente não há integração com banco de dados.
* Os dados são mantidos apenas em memória e são perdidos ao reiniciar o servidor.
* A documentação da API é gerada automaticamente pelo Swagger utilizando comentários nas rotas.

---

## 3. Entidades e Relacionamentos

| Entidade     | Arquivo                           | Descrição                           |
| ------------ | --------------------------------- | ----------------------------------- |
| Evento       | `src/models/EventoModel.js`       | Evento disponível para inscrição    |
| Participante | `src/models/ParticipanteModel.js` | Usuário que participa dos eventos   |
| Inscrição    | `src/models/InscricaoModel.js`    | Relação entre participante e evento |

### 🔗 Relacionamentos

* Um Evento pode possuir várias Inscrições
* Um Participante pode possuir várias Inscrições

```text
Evento 1 ─── N Inscrições
Participante 1 ─── N Inscrições
```

---

## 4. Endpoints da API

### 🎫 Eventos

| Método | Rota                  | Descrição            |
| ------ | --------------------- | -------------------- |
| GET    | `/eventos`            | Listar eventos       |
| GET    | `/eventos/:id`        | Buscar evento por ID |
| POST   | `/eventos`            | Criar evento         |
| PUT    | `/eventos/:id`        | Atualizar evento     |
| DELETE | `/eventos/:id`        | Remover evento       |
| POST   | `/eventos/:id/banner` | Upload de banner     |

---

### 👥 Participantes

| Método | Rota                 | Descrição                  |
| ------ | -------------------- | -------------------------- |
| GET    | `/participantes`     | Listar participantes       |
| GET    | `/participantes/:id` | Buscar participante por ID |
| POST   | `/participantes`     | Criar participante         |
| PUT    | `/participantes/:id` | Atualizar participante     |
| DELETE | `/participantes/:id` | Remover participante       |

---

### 📝 Inscrições

| Método | Rota              | Descrição               |
| ------ | ----------------- | ----------------------- |
| GET    | `/inscricoes`     | Listar inscrições       |
| GET    | `/inscricoes/:id` | Buscar inscrição por ID |
| POST   | `/inscricoes`     | Criar inscrição         |
| PUT    | `/inscricoes/:id` | Atualizar inscrição     |
| DELETE | `/inscricoes/:id` | Remover inscrição       |

---

## 5. Tecnologias Utilizadas

| Tecnologia         | Finalidade                                 |
| ------------------ | ------------------------------------------ |
| Node.js            | Ambiente de execução JavaScript            |
| Express.js         | Framework para criação da API              |
| swagger-jsdoc      | Geração automática da documentação OpenAPI |
| swagger-ui-express | Interface visual da documentação Swagger   |

---

## 6. Estrutura de Pastas

```text
docs/
 ├── arquitetura.md
 ├── definition-of-done.md
 ├── pesquisa-mercado.md
 ├── auditoria-qualidade.md
 ├── standup-log.md
 └── sprint-reviews/
      └── sprint-1.md
      └── sprint-2.md

src/
 ├── app.js
 ├── server.js
 ├── swagger.js
 ├── controllers/
 ├── models/
 └── routes/
```

---

## 7. Variáveis de Ambiente

| Variável |                   Descrição                    |
| -------- | ---------------------------------------------- |
| PORT     | Porta utilizada pelo servidor (padrão: `3000`) |

> ⚠️ Observação: o projeto ainda não utiliza arquivo `.env` nem integração com banco de dados.
