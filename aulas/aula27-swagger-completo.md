# Aula 27 — Swagger Completo: Documentação de Toda a API

> **Bloco 5** · Terça-feira · Semana 14 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Começa o **último bloco**! Hoje vamos consolidar a **documentação Swagger** para cobrir 100% da API. No Bloco 1, fizemos um Swagger básico. Agora vamos documentar tudo — incluindo as rotas de notificações, exportação e upload.

**O que você vai produzir hoje:**
- [x] Revisar e completar schemas de todas as entidades
- [x] Documentar todas as rotas que faltam
- [x] Adicionar exemplos de erro nas respostas
- [x] Swagger 100% funcional e testável no /api-docs

---

## 📋 Parte 1 — Auditoria do Swagger Atual

Antes de documentar, verifiquem o que já está feito. Acessem `http://localhost:3000/api-docs` e marquem:

### Rotas documentadas no Swagger

| Rota | Documentada? |
|---|---|
| **Eventos** | |
| GET /eventos | ✅ / ❌ |
| GET /eventos/:id | ✅ / ❌ |
| POST /eventos | ✅ / ❌ |
| PUT /eventos/:id | ✅ / ❌ |
| DELETE /eventos/:id | ✅ / ❌ |
| POST /eventos/:id/banner | ✅ / ❌ |
| **Participantes** | |
| GET /participantes | ✅ / ❌ |
| GET /participantes/:id | ✅ / ❌ |
| POST /participantes | ✅ / ❌ |
| PUT /participantes/:id | ✅ / ❌ |
| DELETE /participantes/:id | ✅ / ❌ |
| **Inscrições** | |
| POST /inscricoes | ✅ / ❌ |
| GET /inscricoes | ✅ / ❌ |
| GET /inscricoes/evento/:eventoId | ✅ / ❌ |
| PATCH /inscricoes/:id/cancelar | ✅ / ❌ |
| **Notificações** | |
| GET /notificacoes | ✅ / ❌ |
| GET /notificacoes/estatisticas | ✅ / ❌ |
| GET /notificacoes/:id | ✅ / ❌ |
| POST /notificacoes/:id/reenviar | ✅ / ❌ |
| POST /notificacoes/teste-email | ✅ / ❌ |
| **Exportação** | |
| GET /exportar/eventos/xml | ✅ / ❌ |
| GET /exportar/eventos/json | ✅ / ❌ |
| GET /exportar/relatorio/inscricoes | ✅ / ❌ |

### Dividam as rotas faltantes entre os membros do grupo!

> ⚠️ **Regra importante:** o comentário `@swagger` de uma rota **deve estar no mesmo arquivo** onde o `router.get()`, `router.post()` etc. daquela rota está declarado. Exemplo: a documentação de `GET /participantes` vai em `participanteRoutes.js`, a de `POST /inscricoes` vai em `inscricaoRoutes.js`, e assim por diante.

---

## 🛠️ Parte 2 — Documentando Rotas Avançadas

### Upload de arquivo (multipart/form-data)

A documentação de upload no Swagger é um pouco diferente:

```javascript
/**
 * @swagger
 * /eventos/{id}/banner:
 *   post:
 *     summary: Fazer upload do banner do evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do banner (JPEG, PNG, GIF, WebP — máx 5MB)
 *     responses:
 *       200:
 *         description: Banner atualizado
 *       400:
 *         description: Nenhum arquivo enviado ou tipo inválido
 *       404:
 *         description: Evento não encontrado
 */
```

### Rota com query parameters (paginação e filtros)

```javascript
/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Listar eventos com paginação e filtros
 *     tags: [Eventos]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: porPagina
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Buscar por nome do evento
 *       - in: query
 *         name: ordenarPor
 *         schema:
 *           type: string
 *           default: data
 *         description: Campo para ordenação
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *     responses:
 *       200:
 *         description: Lista paginada de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Evento'
 *                 total:
 *                   type: integer
 *                 pagina:
 *                   type: integer
 *                 totalPaginas:
 *                   type: integer
 */
```

### Respostas de erro padronizadas

Adicionem o schema de erro nos components. **O local certo é o `eventoRoutes.js`**, dentro do bloco `@swagger` que já declara o schema `Evento` — basta adicionar `Erro` logo abaixo, **dentro do mesmo bloco de comentário**:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       required:
 *         - nome
 *         - data
 *       properties:
 *         id:
 *           type: integer
 *           description: ID gerado automaticamente
 *         nome:
 *           type: string
 *           description: Nome do evento
 *         descricao:
 *           type: string
 *           description: Descrição do evento
 *         data:
 *           type: string
 *           description: Data do evento
 *         local:
 *           type: string
 *           description: Local do evento
 *         capacidade:
 *           type: integer
 *           description: Capacidade máxima
 *       example:
 *         id: 1
 *         nome: Workshop de Node.js
 *         descricao: Aprenda Node.js do zero
 *         data: "2025-08-15"
 *         local: SENAI - Sala 3
 *         capacidade: 30
 *     Erro:
 *       type: object
 *       properties:
 *         erro:
 *           type: object
 *           properties:
 *             tipo:
 *               type: string
 *               example: NotFoundError
 *             mensagem:
 *               type: string
 *               example: Evento não encontrado(a)
 *             statusCode:
 *               type: integer
 *               example: 404
 */
```

> ⚠️ Não crie um bloco `@swagger` separado para o `Erro` — adicione dentro do bloco que já existe, no mesmo nível de indentação que o `Evento`.

> 💡 Declare o schema `Erro` **uma única vez** em qualquer arquivo. Depois, qualquer rota em qualquer arquivo do projeto pode referenciá-lo com `$ref: '#/components/schemas/Erro'`.

Para usar o schema nas respostas de erro, adicione o `content` com o `$ref` dentro do bloco `@swagger` da rota:

```javascript
/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Buscar evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
```

---

## 🧩 Desafio — Documentar Todas as Rotas que Faltam

Cada membro pega um grupo de rotas e documenta. No final, façam `GET /api-docs` e confirmem que **todas as 23 rotas** aparecem e o "Try it out" funciona.

---

## ✅ Checklist — Antes de Sair

- [ ] Auditoria feita — listei quais rotas faltavam
- [ ] Todas as 23+ rotas documentadas no Swagger
- [ ] Schemas de todas as entidades (Evento, Participante, Inscrição, Notificação, Erro)
- [ ] Exemplos de request/response em cada rota
- [ ] "Try it out" funciona para todas as rotas
- [ ] Commit e push

---

> **Próxima aula:** Conceitos de deploy e preparação para publicar a API na nuvem.
