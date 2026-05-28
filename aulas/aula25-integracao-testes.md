# Aula 25 — Integração Completa \+ Testes

**Bloco 4** · Terça-feira · Semana 13 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje vamos testar o **fluxo completo** da API de ponta a ponta: criar evento → cadastrar participante → inscrever → receber e-mail → consultar histórico. Também vamos resolver pendências e refatorar o que precisar.

**O que você vai produzir hoje:**

- [x] Executar teste de integração completo (fluxo end-to-end)  
- [x] Verificar e corrigir problemas encontrados  
- [x] Atualizar o Swagger com rotas de Notificações  
- [x] Refatorar código baseado nos testes

---

## 🔄 Parte 1 — Teste de Integração End-to-End

Sigam este roteiro **na ordem** — cada passo depende do anterior:

### Preparação

npm run db:reset    \# Limpa e recria o banco com seeds

npm run dev         \# Inicia o servidor

### Roteiro de Testes

| \# | Ação | Endpoint | Esperado |
| :---- | :---- | :---- | :---- |
| 1 | Listar eventos (seed) | `GET /eventos` | 3 eventos retornados |
| 2 | Criar evento novo | `POST /eventos` | 201, evento com ID 4 |
| 3 | Criar participante | `POST /participantes` | 201, participante com ID 4 |
| 4 | Inscrever no evento | `POST /inscricoes` (eventoId: 4, participanteId: 4\) | 201, inscrição criada |
| 5 | Verificar e-mail enviado | Abrir MailPit no navegador | E-mail de confirmação bonito |
| 6 | Verificar notificação no banco | `GET /notificacoes` | Notificação com `enviada: true` |
| 7 | Tentar inscrição duplicada | `POST /inscricoes` (mesmos IDs) | 400, "já inscrito" |
| 8 | Cancelar inscrição | `PATCH /inscricoes/:id/cancelar` | 200, status "cancelada" |
| 9 | Verificar e-mail de cancelamento | Abrir MailPit | E-mail de cancelamento |
| 10 | Ver estatísticas | `GET /notificacoes/estatisticas` | total, enviadas, porTipo |
| 11 | Reenviar notificação | `POST /notificacoes/1/reenviar` | 200 \+ e-mail no MailPit |
| 12 | Exportar eventos XML | `GET /exportar/eventos/xml` | XML válido |
| 13 | Exportar relatório | `GET /exportar/relatorio/inscricoes` | JSON com inscritos por evento |
| 14 | Upload de banner | `POST /eventos/2/banner` (form-data) | Banner salvo |
| 15 | Swagger completo | `GET /api-docs` | Página funcional |
| 16 | **Reiniciar servidor** | `Ctrl+C` \+ `npm run dev` | — |
| 17 | Listar eventos | `GET /eventos` | Tudo persiste\! |

### Registre os resultados

Crie um arquivo `docs/teste-integracao.md`:

\# Teste de Integração — Bloco 4

\*\*Data:\*\* \[data\]

\*\*Testador:\*\* \[nome\]

| \# | Teste | Resultado | Observação |

|---|---|---|---|

| 1 | GET /eventos (seed) | ✅ / ❌ | |

| 2 | POST /eventos | ✅ / ❌ | |

| ... | ... | | |

| 17 | Persistência após reinício | ✅ / ❌ | |

\*\*Problemas encontrados:\*\*

\- \[lista\]

\*\*Correções feitas:\*\*

\- \[lista\]

---

## 🔧 Parte 2 — Corrigindo Problemas Comuns

Aqui vão os problemas mais frequentes que os grupos encontram:

### Problema 1: Observer falha silenciosamente

Se o observer tem um erro, ele é capturado pelo `catch` e logado no console, mas o Postman não mostra nada de errado. Verifiquem o terminal\!

### Problema 2: Notificação criada mas `enviada: false`

O e-mail pode falhar sem derrubar a inscrição. Verifiquem se o MailPit está rodando e o IP está correto no `.env` (o `inicializar()` precisa conectar antes de qualquer envio).

### Problema 3: Include retorna null

Se `inscricao.evento` é `null`, provavelmente o relacionamento no `models/index.js` não está correto. Confiram os `foreignKey` e `as`.

### Problema 4: Swagger desatualizado

As rotas novas (notificações, exportação) provavelmente não estão documentadas no Swagger. Vamos resolver agora.

---

## 📝 Parte 3 — Atualizando o Swagger

Adicionem a documentação das rotas de Notificações no `notificacaoRoutes.js`:
````
/\*\*

 \* @swagger

 \* components:

 \*   schemas:

 \*     Notificacao:

 \*       type: object

 \*       properties:

 \*         id:

 \*           type: integer

 \*         tipo:

 \*           type: string

 \*           enum: \[confirmacao, lembrete\]

 \*         destinatario\_email:

 \*           type: string

 \*         assunto:

 \*           type: string

 \*         enviada:

 \*           type: boolean

 \*         data\_envio:

 \*           type: string

 \*           format: date-time

 \*/

/\*\*

 \* @swagger

 \* /notificacoes:

 \*   get:

 \*     summary: Listar notificações

 \*     tags: \[Notificações\]

 \*     parameters:

 \*       \- in: query

 \*         name: tipo

 \*         schema:

 \*           type: string

 \*           enum: \[confirmacao, lembrete\]

 \*       \- in: query

 \*         name: enviada

 \*         schema:

 \*           type: string

 \*           enum: \[true, false\]

 \*     responses:

 \*       200:

 \*         description: Lista de notificações

 \*/

/\*\*

 \* @swagger

 \* /notificacoes/estatisticas:

 \*   get:

 \*     summary: Estatísticas de envio

 \*     tags: \[Notificações\]

 \*     responses:

 \*       200:

 \*         description: Contagens de notificações

 \*/

/\*\*

 \* @swagger

 \* /notificacoes/{id}/reenviar:

 \*   post:

 \*     summary: Reenviar uma notificação

 \*     tags: \[Notificações\]

 \*     parameters:

 \*       \- in: path

 \*         name: id

 \*         required: true

 \*         schema:

 \*           type: integer

 \*     responses:

 \*       200:

 \*         description: Notificação reenviada

 \*       404:

 \*         description: Notificação não encontrada

 \*/
 ````

💡 Se o grupo tiver tempo, documentem também as rotas de exportação e upload.

---

## 🧩 Desafio — Collection do Postman Completa

Atualizem a collection do Postman com **todas** as rotas da API organizada em pastas:

📁 Notificações API

├── 📁 Eventos (GET, GET/:id, POST, PUT, DELETE, POST banner)

├── 📁 Participantes (GET, GET/:id, POST, PUT, DELETE)

├── 📁 Inscrições (POST, GET, GET/evento/:id, PATCH cancelar)

├── 📁 Notificações (GET, GET/:id, GET/estatísticas, POST reenviar, POST teste)

└── 📁 Exportação (GET XML, GET JSON, GET relatório)

Exportem para `docs/postman-collection.json`.

---

## ✅ Checklist — Antes de Sair

- [ ] Teste end-to-end executado (17 passos)  
- [ ] `docs/teste-integracao.md` preenchido com resultados  
- [ ] Problemas encontrados corrigidos  
- [ ] Swagger atualizado com rotas de Notificações  
- [ ] Collection do Postman atualizada e exportada  
- [ ] Commit e push

---

**Próxima aula:** Ajustes finais e entrega do Bloco 4\!  
