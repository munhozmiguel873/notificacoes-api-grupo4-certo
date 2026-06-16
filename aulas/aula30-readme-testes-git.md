# Aula 30 — README Final, Testes e Organização do Git

> **Bloco 5** · Quinta-feira · Semana 15 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Hoje é dia de **polir o repositório** para que qualquer pessoa (professor, recrutador, futuro colega) consiga entender e rodar o projeto. Também faremos os últimos testes para garantir que tudo funciona.

**O que você vai produzir hoje:**

- [x] README.md final e profissional
- [x] Testes manuais finais no Postman
- [x] Histórico de commits limpo e organizado
- [x] Repositório pronto para apresentação

---

## 📖 Parte 1 — README Final

O README é o **cartão de visita** do projeto. É a primeira coisa que qualquer pessoa vê ao acessar o repositório. Substituam o README atual por um completo e profissional:

````markdown
# 🔔 Notificações API

API REST para módulo de notificações por e-mail de uma plataforma de eventos.

![Node.js](https://img.shields.io/badge/Node.js-24+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MariaDB](https://img.shields.io/badge/MariaDB-11.x-blue)
![Deploy](https://img.shields.io/badge/Deploy-Servidor%20SENAI-blueviolet)

**🌐 URL de Produção:** [endereço IP do seu container no servidor]
**📚 Documentação:** [sua URL]/api-docs

---

## 📋 Sobre o Projeto

Sistema de notificações por e-mail para uma plataforma de eventos.
Quando um participante se inscreve em um evento, recebe automaticamente
um e-mail de confirmação. O sistema também envia notificações de cancelamento.

**Desenvolvido como projeto da SA2** — SENAI "Santo Paschoal Crepaldi"
Curso: Técnico em Desenvolvimento de Sistemas
UCs: Programação Back-End + Projetos de Software

### Equipe

- [Nome 1] — [GitHub](https://github.com/user1)
- [Nome 2] — [GitHub](https://github.com/user2)
- [Nome 3] — [GitHub](https://github.com/user3)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 24+
- MySQL 8.0 ou MariaDB 11+
- Git

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/USUARIO/notificacoes-api-grupoX.git
   cd notificacoes-api-grupoX
   ```
````

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o ambiente:

   ```bash
   cp .env.example .env
   # Edite o .env com suas credenciais do banco de dados
   ```

4. Crie o banco e execute as migrations:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

6. Acesse:
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/api-docs

---

## 📚 Rotas da API

### Eventos

[tabela com rotas]

### Participantes

[tabela com rotas]

### Inscrições

[tabela com rotas]

### Notificações

[tabela com rotas]

### Exportação

[tabela com rotas]

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

[estrutura de pastas]

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

````

> Adaptem com as informações reais do grupo!

---

## 🧪 Parte 2 — Testes Manuais Finais

Executem o roteiro de testes **tanto no localhost quanto na URL de produção**:

| Teste | Local | Produção |
|---|---|---|
| `GET /` (raiz) | ✅/❌ | ✅/❌ |
| `GET /eventos` | ✅/❌ | ✅/❌ |
| `POST /eventos` | ✅/❌ | ✅/❌ |
| `GET /api-docs` (Swagger) | ✅/❌ | ✅/❌ |
| `POST /inscricoes` + e-mail | ✅/❌ | ✅/❌ |
| `GET /notificacoes/estatisticas` | ✅/❌ | ✅/❌ |

> Se algo não funciona em produção mas funciona localmente, o problema geralmente é variável de ambiente ou banco de dados.

---

## 🧹 Parte 3 — Organização do Git

### Verificar que nada sensível está no repo

```bash
# Verificar que .env não está no repo
git ls-files .env

# Verificar que node_modules não está no repo
git ls-files node_modules/

# Verificar que uploads não está no repo
git ls-files uploads/
````

Se qualquer um retornar resultado, removam:

```bash
git rm --cached .env
git rm -r --cached node_modules/
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove arquivos sensíveis do repositório"
```

### Verificar contribuições

```bash
git shortlog -sn
```

Deve mostrar commits de **todos** os membros. Se alguém tem poucos commits, façam pair programming nos ajustes finais para equilibrar.

---

## ✅ Checklist — Antes de Sair

- [ ] README final profissional e completo
- [ ] Testes manuais passando (local + produção)
- [ ] Nenhum arquivo sensível no repositório
- [ ] Todos os membros com commits
- [ ] `.env.example` com todas as variáveis
- [ ] Collection do Postman exportada em `docs/`
- [ ] Commit e push final

---

> **Próxima aula:** Apresentação final dos projetos — o grande dia!
