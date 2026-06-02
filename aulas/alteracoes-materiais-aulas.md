# Alterações nos Materiais de Aula

> Gerado em: 01/06/2026
>
> Este documento lista as correções aplicadas nos arquivos de aula durante a revisão do projeto de referência. Todos os arquivos listados abaixo devem ser redistribuídos aos alunos.

---

## Bloco 4

### Aula 24 — Regras de Negócio e Histórico de Notificações

**Arquivo:** `Bloco 4/aula24-regras-negocio-historico.md`

**Correções:**

1. **Imports desnecessários removidos** no exemplo de código do `NotificacaoService.js`

   O material mostrava dois imports que nunca são usados no arquivo, o que causaria confusão nos alunos:

   ```javascript
   // ANTES (incorreto — imports não utilizados)
   const { NotFoundError, ValidationError } = require("../errors/AppError");
   const confirmacaoInscricao = require("../templates/email/confirmacaoInscricao");

   // DEPOIS (correto)
   const { NotFoundError } = require("../errors/AppError");
   ```

2. **Nome de campo errado na função `reenviar()`**

   O material usava o nome da coluna do banco (`destinatario_email`, `data_envio`) em vez do nome do atributo JavaScript definido no Model (`destinatarioEmail`, `dataEnvio`). Isso faria o e-mail ser enviado para `undefined` e o registro não seria atualizado:

   ```javascript
   // ANTES (incorreto — nomes de coluna do banco)
   await EmailService.enviar(notificacao.destinatario_email, ...)
   await notificacao.update({ enviada: true, data_envio: new Date() })

   // DEPOIS (correto — nomes de atributo JS)
   await EmailService.enviar(notificacao.destinatarioEmail, ...)
   await notificacao.update({ enviada: true, dataEnvio: new Date() })
   ```

   > **Regra:** O `field: "nome_coluna"` no Model serve apenas para mapear a coluna no banco. No código JavaScript, sempre use o nome do atributo em camelCase.

---

### Aula 25 — Integração Completa e Testes

**Arquivo:** `Bloco 4/aula25-integracao-testes.md`

**Correções:**

1. **Nomes de campo errados no schema Swagger do `NotificacaoService`**

   O material mostrava os nomes de coluna do banco no schema de documentação, mas o Sequelize serializa os campos pelo nome do atributo JS (camelCase):

   ```javascript
   // ANTES (incorreto — nomes de coluna do banco)
   *         destinatario_email:
   *           type: string
   *         data_envio:
   *           type: string

   // DEPOIS (correto — nomes de atributo JS, como a API realmente retorna)
   *         destinatarioEmail:
   *           type: string
   *         dataEnvio:
   *           type: string
   ```

---

## Resumo

| Arquivo                                      | Tipo de alteração                                                  |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `Bloco 4/aula24-regras-negocio-historico.md` | Correção de bug (campo errado) + remoção de imports desnecessários |
| `Bloco 4/aula25-integracao-testes.md`        | Correção de bug (campo errado no schema Swagger)                   |
