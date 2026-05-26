# Aula 19 — Cache em Memória + Consolidação

> **Bloco 3** · Terça-feira · Semana 10 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje vamos aprender o conceito de **cache em memória** — uma técnica para acelerar sua API evitando consultas repetidas ao banco. Depois, vamos usar o restante da aula para **consolidar e revisar** todo o Bloco 3.

**O que você vai produzir hoje:**
- [x] Entender o que é cache e por que usar
- [x] Implementar cache simples em memória com node-cache
- [x] Revisar e completar funcionalidades pendentes
- [x] Garantir que toda a API está funcional com banco de dados

---

## ⚡ Parte 1 — O Que É Cache?

Imagine que o front-end faz `GET /eventos` a cada 5 segundos (para atualizar a tela). Cada chamada vai ao banco de dados, executa um SELECT e retorna os dados. Se os eventos não mudam com tanta frequência, estamos fazendo consultas desnecessárias.

**Cache** é guardar o resultado de uma consulta em memória para reusá-lo nas próximas vezes:

```
Sem cache:  Requisição → Banco → Resposta (50ms)
            Requisição → Banco → Resposta (50ms)
            Requisição → Banco → Resposta (50ms)

Com cache:  Requisição → Banco → Resposta (50ms)  ← guarda no cache
            Requisição → Cache → Resposta (1ms)    ← rápido!
            Requisição → Cache → Resposta (1ms)    ← rápido!
            [cache expira depois de X segundos]
            Requisição → Banco → Resposta (50ms)  ← renova o cache
```

### Quando usar cache?

| Situação | Cache? |
|---|---|
| Dados que mudam raramente (lista de categorias) | Sim |
| Dados que mudam com frequência (mensagens de chat) | Não |
| Consultas pesadas (relatórios com muitos JOINs) | Sim |
| Dados sensíveis (saldo bancário) | Com cuidado |

> 💡 O Plano de Curso menciona "banco de dados em memória". O cache é exatamente isso: uma camada de dados que vive na memória RAM para acesso rápido. No mundo real, ferramentas como Redis fazem isso em escala. Aqui vamos usar uma solução simples.

---

## 🛠️ Parte 2 — Implementando Cache Simples

### Instalação

```bash
npm install node-cache
```

### Criando o serviço de cache

```javascript
// src/config/cache.js
const NodeCache = require('node-cache');

// stdTTL: tempo de vida padrão em segundos (60 = 1 minuto)
// checkperiod: intervalo para verificar itens expirados
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

module.exports = cache;
```

### Criando um middleware de cache

Em vez de adicionar cache em cada rota manualmente, vamos criar um middleware reutilizável:

```javascript
// src/middlewares/cacheMiddleware.js
const cache = require('../config/cache');

function cacheMiddleware(duracaoSegundos) {
  return (req, res, next) => {
    // Só cachear requisições GET
    if (req.method !== 'GET') {
      return next();
    }

    const chave = req.originalUrl;
    const dadosCache = cache.get(chave);

    if (dadosCache) {
      console.log(`[CACHE HIT] ${chave}`);
      return res.json(dadosCache);
    }

    // Sobrescrever res.json para interceptar a resposta
    const jsonOriginal = res.json.bind(res);
    res.json = (dados) => {
      cache.set(chave, dados, duracaoSegundos);
      console.log(`[CACHE MISS] ${chave} — armazenado por ${duracaoSegundos}s`);
      jsonOriginal(dados);
    };

    next();
  };
}

module.exports = cacheMiddleware;
```

### Aplicando o cache nas rotas

```javascript
// src/routes/eventoRoutes.js
const cacheMiddleware = require('../middlewares/cacheMiddleware');

// Cache de 30 segundos na listagem de eventos
router.get('/', cacheMiddleware(30), EventoController.index);

// Cache de 60 segundos na busca por ID
router.get('/:id', cacheMiddleware(60), EventoController.show);

// POST, PUT, DELETE NÃO têm cache (o middleware ignora automaticamente)
```

### Invalidando o cache

Quando um evento é criado, atualizado ou deletado, o cache precisa ser limpo. Adicione isso nos métodos do Controller que alteram dados:

```javascript
const cache = require('../config/cache');

async function store(req, res, next) {
  try {
    const novoEvento = await EventoService.criar(req.body);
    cache.flushAll(); // Limpa todo o cache
    res.status(201).json(novoEvento);
  } catch (erro) {
    next(erro);
  }
}

// Faça o mesmo no update e destroy
```

> 💡 `cache.flushAll()` é simples mas eficaz para nosso caso. Em sistemas maiores, você invalidaria apenas as chaves relevantes (`cache.del('/eventos')`).

### Teste

1. Faça `GET /eventos` — no terminal: `[CACHE MISS] /eventos`
2. Faça `GET /eventos` de novo — no terminal: `[CACHE HIT] /eventos` (muito mais rápido!)
3. Espere 30 segundos e repita — será MISS de novo (cache expirou)
4. Faça `POST /eventos` — cache limpo automaticamente

---

## 🔧 Parte 3 — Consolidação do Bloco 3

Use o restante da aula para revisar e completar tudo. Aqui está o checklist completo do que deve estar funcionando:

### Funcionalidades de Banco de Dados

- [ ] MySQL conectado via Sequelize
- [ ] 4 Models definidos (Evento, Participante, Inscricao, Notificacao)
- [ ] Relacionamentos configurados no `models/index.js`
- [ ] Migrations para todas as tabelas (incluindo banner)
- [ ] Seeds com dados iniciais

### CRUD Completo com Banco Real

|   Entidade   | Create | Read (all) | Read (by id)  |    Update     | Delete |
|--------------|--------|------------|---------------|---------------|--------|
| Evento       |   ✅   |     ✅    |       ✅      |      ✅      |   ✅   |
| Participante |   ✅   |     ✅    |       ✅      |      ✅      |   ✅   |
| Inscrição    |   ✅   |     ✅    |✅ (por evento)| — (cancelar)  | —————— |

> Se algo está faltando, este é o momento de completar. Dividam as tarefas no grupo!

### Funcionalidades Extras

- [ ] Paginação no GET /eventos
- [ ] Exportação em XML (GET /exportar/eventos/xml)
- [ ] Exportação em JSON (GET /exportar/eventos/json)
- [ ] Upload de banner (POST /eventos/:id/banner)
- [ ] Relatório de inscrições (GET /exportar/relatorio/inscricoes)
- [ ] Cache em memória nas rotas GET

### Qualidade de Código

- [ ] Validações funcionando (Sequelize + helpers)
- [ ] Erros do Sequelize tratados no errorHandler
- [ ] Variáveis de ambiente para todas as configurações
- [ ] Código limpo, sem console.log de debug

---

## 🧩 Desafio — Documentar Swagger das Novas Rotas

Se o grupo terminou tudo, atualizem o Swagger com as novas rotas:
- GET /exportar/eventos/xml
- GET /exportar/eventos/json
- GET /exportar/relatorio/inscricoes
- POST /eventos/:id/banner

---

## ✅ Checklist — Antes de Sair

- [ ] Cache implementado e funcionando
- [ ] Todas as funcionalidades do Bloco 3 revisadas
- [ ] Funcionalidades pendentes completadas
- [ ] API inteira testada no Postman
- [ ] Commit e push

---

> **Próxima aula:** Revisão final e entrega do Bloco 3!
