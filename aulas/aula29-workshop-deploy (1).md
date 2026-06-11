# Aula 29 — Workshop de Deploy: Instalação e Publicação no Servidor

> **Bloco 5** · Terça-feira · Semana 15 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje é o grande dia — vamos **instalar tudo no container** e colocar a API rodando no servidor! Ao final, cada grupo terá a API acessível na rede da sala via IP.

**O que você vai produzir hoje:**

- [x] Instalar Node.js, MariaDB e PM2 no container
- [x] Configurar o banco de dados de produção
- [x] Clonar o projeto e fazer o deploy
- [x] API rodando em background com PM2
- [x] Acessar a API via IP do container no navegador

---

## 🔌 Passo 0 — Conectar no Container

```bash
ssh root@10.137.146.x
# ou, se configurou o atalho:
ssh servidor-grupo1
```

> A partir daqui, **todos os comandos** são executados dentro do container (Linux Debian).

---

## 📦 Passo 1 — Atualizar o Sistema

Sempre comece atualizando os pacotes do sistema:

```bash
apt update && apt upgrade -y
```

---

## 🟢 Passo 2 — Instalar o Node.js

Vamos instalar o Node.js 24 (LTS) usando o nvm:

```bash
# Instalar curl (se não tiver)
apt install curl

# Download e instalação do nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash

# Reiniciando o shell para carregar o nvm:
\. "$HOME/.nvm/nvm.sh"

# Download e instalação do Node.js (última versão LTS, que é a 24):
nvm install --lts

# Verificar versões
node -v    # deve mostrar v24.x.x
npm -v     # deve mostrar 11.x.x
```

---

## 🗄️ Passo 3 — Instalar e Configurar o MariaDB

> ⚠️ **Atenção (Debian 13 Trixie):** O repositório oficial do MySQL não suporta Debian 13. Nos containers Debian da sala, instale o **MariaDB** — ele é 100% compatível com MySQL (mesmos comandos SQL, mesma porta 3306, funciona igual com Sequelize).

```bash
# Instalar MariaDB Server
apt install -y mariadb-server

# Iniciar e habilitar o serviço
systemctl start mariadb
systemctl enable mariadb

# Verificar se está rodando
systemctl status mariadb
```

Deve aparecer `active (running)` em verde.

### Configurar o banco de dados

```bash
# Acessar o MariaDB como root
mysql
```

Dentro do prompt do MariaDB (`mysql>`), execute:

```sql
-- Criar o banco de dados
CREATE DATABASE notificacoes_db;

-- Criar um usuário para a aplicação (mais seguro que usar root)
CREATE USER 'notificacoes_user'@'localhost' IDENTIFIED BY 'SenhaForte123!';

-- Dar permissões ao usuário no banco
GRANT ALL PRIVILEGES ON notificacoes_db.* TO 'notificacoes_user'@'localhost';

-- Aplicar as permissões
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;

-- Sair
EXIT;
```

> ⚠️ Em produção, **nunca use root** para a aplicação. Criamos um usuário específico com acesso apenas ao banco necessário.

### Testar a conexão

```bash
mysql -u notificacoes_user -p notificacoes_db
# Digite a senha: SenhaForte123!
# Se entrou, funcionou! Digite EXIT para sair.
```

---

## 🔧 Passo 4 — Instalar o Git e Clonar o Projeto

```bash
# Instalar Git
apt install -y git

# Criar pasta para aplicações
mkdir -p /var/www
cd /var/www

# Clonar o repositório do grupo
git clone https://github.com/USUARIO/notificacoes-api-grupoX.git
cd notificacoes-api-grupoX

# Instalar dependências
npm install
```

### Criar o arquivo `.env` de produção

```bash
nano .env
```

Cole o seguinte conteúdo (ajuste os valores):

```env
# Configurações do servidor
PORT=3000

# Ambiente
NODE_ENV=production

# Configurações do banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=notificacoes_db
DB_USER=notificacoes_user
DB_PASSWORD=SenhaForte123!

# Configuraçoes Mailpit - servidor de e-mail
SMTP_HOST=10.137.146.106
SMTP_PORT=1025
```

Salve: `Ctrl+O`, Enter, `Ctrl+X`.

### Criar o arquivo `database.json` para o Sequelize CLI

O Sequelize CLI usa este arquivo separado para executar migrations e seeds. Crie-o na pasta correta:

```bash
nano src/config/database.json
```

Cole o seguinte conteúdo (as credenciais de produção devem coincidir com o que foi criado no banco):

```json
{
  "production": {
    "username": "notificacoes_user",
    "password": "SenhaForte123!",
    "database": "notificacoes_db",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql"
  }
}
```

Salve: `Ctrl+O`, Enter, `Ctrl+X`.

### Executar Migrations e Seeds

> ⚠️ O Sequelize CLI **não lê o `.env` automaticamente**. É preciso passar o `NODE_ENV` diretamente no comando para que ele use o bloco `"production"` do `database.json`.

```bash
NODE_ENV=production npx sequelize-cli db:migrate
NODE_ENV=production npx sequelize-cli db:seed:all
```

Verifique no banco de dados:

```bash
mysql -u notificacoes_user -p notificacoes_db -e "SHOW TABLES;"
```

Devem aparecer as 4 tabelas + SequelizeMeta.

### Criar pasta de uploads

```bash
mkdir -p uploads
```

---

## 🧪 Passo 5 — Testar Manualmente

```bash
npm start
```

Deve aparecer:

```
Conexão com MySQL estabelecida com sucesso!
📧 E-mail de teste configurado!
Servidor rodando em http://localhost:3000
```

**Teste de outro computador da sala** (ou do seu próprio computador):

```
http://10.137.146.x:3000/
http://10.137.146.x:3000/api-docs
http://10.137.146.x:3000/eventos
```

> ✅ Se acessou do navegador do seu computador e viu a API respondendo — **o deploy funcionou!**

Pare o servidor com `Ctrl+C` (vamos configurar o PM2 para rodar em background).

---

## ⚡ Passo 6 — Instalar e Configurar o PM2

O **PM2** é um process manager para Node.js. Ele mantém sua aplicação rodando em background, reinicia automaticamente se crashar e sobrevive a reinicializações do servidor.

### Instalar

```bash
npm install -g pm2
```

### Iniciar a aplicação com PM2

```bash
cd /var/www/notificacoes-api-grupoX
pm2 start src/server.js --name "notificacoes-api"
```

### Verificar status

```bash
pm2 status
```

Saída:

```
┌─────┬──────────────────────┬─────────────┬──────┬───────────┬──────────┐
│ id  │ name                 │ mode        │ ↺    │ status    │ cpu      │
├─────┼──────────────────────┼─────────────┼──────┼───────────┼──────────┤
│ 0   │ notificacoes-api     │ fork        │ 0    │ online    │ 0%       │
└─────┴──────────────────────┴─────────────┴──────┴───────────┴──────────┘
```

### Comandos úteis do PM2

```bash
pm2 logs                       # Ver logs em tempo real
pm2 logs notificacoes-api      # Logs só da API
pm2 restart notificacoes-api   # Reiniciar
pm2 stop notificacoes-api      # Parar
pm2 delete notificacoes-api    # Remover do PM2
pm2 monit                      # Monitor visual (CPU, memória)
```

### Configurar para iniciar junto com o container

```bash
pm2 startup
pm2 save
```

Isso garante que se o container reiniciar, a API sobe automaticamente.

---

## 🔄 Passo 7 — Atualizando o Deploy (futuras mudanças)

Quando fizerem alterações no código e quiserem atualizar o servidor:

```bash
# Conectar no container
ssh root@10.137.146.x

# Ir até a pasta do projeto
cd /var/www/notificacoes-api-grupoX

# Puxar as mudanças do GitHub
git pull

# Instalar dependências novas (se houver)
npm install

# Executar migrations novas (se houver)
npx sequelize-cli db:migrate

# Reiniciar a aplicação
pm2 restart notificacoes-api
```

> 💡 No futuro, isso poderia ser automatizado com um script de deploy ou CI/CD. Mas para o nosso contexto, esses 5 comandos são suficientes.

---

## 🧩 Desafio — Script de Deploy Automatizado

Crie um arquivo `deploy.sh` na raiz do projeto (no seu computador) que execute todos os passos de atualização de uma vez:

```bash
#!/bin/bash
# deploy.sh — Script de deploy para o servidor

SERVIDOR="root@10.137.146.x"
PASTA="/var/www/notificacoes-api-grupoX"

echo "🚀 Iniciando deploy..."

ssh $SERVIDOR << 'EOF'
  cd /var/www/notificacoes-api-grupoX
  echo "📥 Puxando mudanças do GitHub..."
  git pull
  echo "📦 Instalando dependências..."
  npm install
  echo "🗄️ Executando migrations..."
  npx sequelize-cli db:migrate
  echo "🔄 Reiniciando a aplicação..."
  pm2 restart notificacoes-api
  echo "✅ Deploy concluído!"
  pm2 status
EOF
```

Para usar:

```bash
# No seu computador (Git Bash):
chmod +x deploy.sh
./deploy.sh
```

> Isso é um **script de deploy** — a forma mais básica de automação. No mercado, ferramentas como GitHub Actions, Jenkins e GitLab CI fazem isso de forma mais sofisticada.

---

## 🎉 Momento de Celebração

Se a API está respondendo no IP do container, vocês acabaram de fazer um **deploy real**:

- A API está rodando num servidor Linux
- Qualquer computador na rede da sala pode acessar
- O PM2 mantém a API rodando mesmo se fecharem o terminal
- O Swagger funciona no navegador de qualquer máquina
- Os e-mails funcionam via MailPit sem restrição de portas

**Testem do computador de vocês:**

```
http://10.137.146.x:3000/              → Mensagem de boas-vindas
http://10.137.146.x:3000/api-docs      → Swagger interativo
http://10.137.146.x:3000/eventos       → Lista de eventos
```

**Compartilhem o IP com os outros grupos** — agora eles podem testar a API de vocês!

---

## 📂 Resumo — O que foi instalado no container

```
Container LXC (Debian 13 Trixie)
├── Node.js 24 LTS (runtime)
├── npm (gerenciador de pacotes)
├── MariaDB Server (banco de dados compatível com MySQL)
│   └── notificacoes_db (banco criado)
├── PM2 (process manager)
├── Git (versionamento)
└── /var/www/notificacoes-api-grupoX/
    ├── .env (configurações de produção)
    ├── node_modules/
    ├── uploads/
    ├── src/ (código da API)
    └── src/config/database.json (configurações do Sequelize CLI)
```

---

## ✅ Checklist — Antes de Sair

- [ ] Node.js instalado no container (`node -v`)
- [ ] MariaDB instalado e rodando (`systemctl status mariadb`)
- [ ] Banco `notificacoes_db` criado com usuário específico
- [ ] Projeto clonado do GitHub
- [ ] `.env` de produção configurado
- [ ] Migrations e Seeds executados
- [ ] API testada manualmente (`npm start`)
- [ ] PM2 instalado e rodando a API em background
- [ ] PM2 configurado para iniciar no boot (`pm2 startup` + `pm2 save`)
- [ ] API acessível pelo navegador via IP do container
- [ ] Swagger funciona no IP do container
- [ ] Todos os membros do grupo conseguem conectar via SSH
- [ ] Commit e push

---

> **Próxima aula:** README final, testes no servidor e preparação para a apresentação.
