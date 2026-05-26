# Auditoria de Qualidade — Sprint 2

**Data:** 14/05/2026
**Revisores:** Equipe de Desenvolvimento

---

# ✅ Checklist de Qualidade

## 📁 Organização

* [ ] Estrutura de pastas segue o padrão MVC + Services
* [ ] Imports organizados (externos primeiro, internos depois)
* [x] Nomes de variáveis e funções são claros e consistentes

---

## ⚠️ Tratamento de Erros

* [x] Todos os controllers utilizam `try/catch` + `next(error)`
* [x] Erros retornam formato padronizado
* [ ] ErrorHandler trata erros específicos do Sequelize

---

## 🔍 Validações

* [x] Todas as rotas POST/PUT possuem validação
* [x] E-mails são validados corretamente
* [x] IDs são convertidos e tratados corretamente

---

## 📚 Documentação

* [x] Swagger cobre todas as rotas atuais
* [x] README está atualizado
* [ ] `.env.example` contém todas as variáveis necessárias

---

## 🌱 Git

* [ ] Todos os membros possuem commits recentes
* [x] Mensagens de commit são descritivas
* [x] `.gitignore` está configurado corretamente

---

# 🛠️ Dívidas Técnicas Encontradas

| # | Descrição                                                | Arquivo                                  | Prioridade | Responsável |
| - | -------------------------------------------------------- | ---------------------------------------- | ---------- | ----------- |
| 1 | Validação de datas incompleta na criação de notificações | `src/validators/notificacaoValidator.js` | Alta       | [Membro]    |
| 2 | ErrorHandler não trata erros específicos do Sequelize    | `src/middlewares/errorHandler.js`        | Alta       | [Membro]    |
| 3 | Falta padronização de imports em alguns controllers      | `src/controllers/`                       | Média      | [Membro]    |
| 4 | Variáveis de ambiente ausentes no `.env.example`         | `.env.example`                           | Média      | [Membro]    |
| 5 | Estrutura MVC inconsistente em alguns módulos            | `src/modules/`                           | Média      | [Membro]    |
| 6 | Alguns commits possuem mensagens genéricas               | Repositório Git                          | Baixa      | [Membro]    |

---

# 📌 Considerações Gerais

A sprint apresentou boa evolução na organização do projeto, implementação das validações e padronização das respostas da API. Ainda existem melhorias importantes relacionadas à arquitetura, tratamento de erros específicos e padronização interna do código, que deverão ser priorizadas na próxima sprint para aumentar a qualidade e a manutenção do sistema.
