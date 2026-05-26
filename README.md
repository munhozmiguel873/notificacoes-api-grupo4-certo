<!-- # Notificações API

API para módulo de notificações por e-mail de uma plataforma de eventos.

## Como rodar

1. Clone o repositório
2. Execute `npm install`
3. Execute `npm start`
4. Acesse `http://localhost:3000`

## Tecnologias

- Node.js
- Express.js -->

# 🔔 Notificações API

API REST para o módulo de notificações por e-mail de uma plataforma de gerenciamento de eventos online.

## 📋 Sobre o Projeto

Este projeto faz parte da Situação de Aprendizagem do curso de Programação Back-End do SENAI.
O módulo é responsável por enviar notificações (confirmação de inscrição, lembretes)
para participantes de eventos.

## 🚀 Como Rodar

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/notificacoes-api.git
   ```

````

2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse:
   - API: http://localhost:3000
   - Documentação: http://localhost:3000/api-docs

## 📚 Rotas Disponíveis

### Eventos

| Método | Rota         | Descrição     |
| ------ | ------------ | ------------- |
| GET    | /eventos     | Listar todos  |
| GET    | /eventos/:id | Buscar por ID |
| POST   | /eventos     | Criar novo    |
| PUT    | /eventos/:id | Atualizar     |
| DELETE | /eventos/:id | Deletar       |

### Participantes

| Método | Rota               | Descrição     |
| ------ | ------------------ | ------------- |
| GET    | /participantes     | Listar todos  |
| GET    | /participantes/:id | Buscar por ID |
| POST   | /participantes     | Criar novo    |
| PUT    | /participantes/:id | Atualizar     |
| DELETE | /participantes/:id | Deletar       |

### Inscrições

| Método | Rota                         | Descrição          |
| ------ | ---------------------------- | ------------------ |
| POST   | /inscricoes                  | Criar inscrição    |
| GET    | /inscricoes                  | Listar todas       |
| GET    | /inscricoes/evento/:eventoId | Listar por evento  |
| PATCH  | /inscricoes/:id/cancelar     | Cancelar inscrição |

## 🛠️ Tecnologias

- Node.js
- Express.js
- Swagger (swagger-jsdoc + swagger-ui-express)

## 📁 Estrutura do Projeto

```
src/
├── models/          → Dados e regras de negócio
├── controllers/     → Lógica das requisições
├── routes/          → Mapeamento de URLs
├── swagger.js       → Configuração do Swagger
├── app.js           → Configuração do Express
└── server.js        → Inicialização do servidor
````
