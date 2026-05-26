# Aula 17 — Manipulação de JSON e Exportação em XML

> **Bloco 3** · Terça-feira · Semana 9 · 5 aulas (225 min)

---

## 🎯 Objetivo da Aula

Hoje vamos aprofundar a **manipulação de dados JSON** nas respostas da API e criar endpoints de **exportação em XML**. São habilidades essenciais para integração com outros sistemas.

**O que você vai produzir hoje:**

- [x] Formatar respostas JSON com paginação e filtros
- [x] Criar consultas avançadas com Sequelize (filtros, busca, ordenação)
- [x] Implementar endpoint de exportação em XML
- [x] Entender quando usar JSON vs XML

---

## 📦 Parte 1 — Respostas JSON Bem Formatadas

Até agora, nosso `GET /eventos` retorna um array simples. Em APIs profissionais, geralmente retornamos um **objeto com metadados**:

```json
{
  "dados": [...],
  "total": 45,
  "pagina": 1,
  "porPagina": 10,
  "totalPaginas": 5
}
```

### Implementando paginação no EventoService

```javascript
// Adicione ao EventoService.js

async function listarTodos(opcoes = {}) {
  const {
    pagina = 1,
    porPagina = 10,
    ordenarPor = "data",
    ordem = "ASC",
    busca = null,
  } = opcoes;

  // Construir filtro de busca
  const where = {};
  if (busca) {
    const { Op } = require("sequelize");
    where.nome = { [Op.like]: `%${busca}%` };
  }

  // Buscar com paginação
  const { count, rows } = await Evento.findAndCountAll({
    where,
    order: [[ordenarPor, ordem.toUpperCase()]],
    limit: parseInt(porPagina),
    offset: (parseInt(pagina) - 1) * parseInt(porPagina),
  });

  return {
    dados: rows,
    total: count,
    pagina: parseInt(pagina),
    porPagina: parseInt(porPagina),
    totalPaginas: Math.ceil(count / parseInt(porPagina)),
  };
}
```

### Atualizando o Controller para receber query params

```javascript
// No EventoController.js
async function index(req, res, next) {
  try {
    const resultado = await EventoService.listarTodos({
      pagina: req.query.pagina,
      porPagina: req.query.porPagina,
      ordenarPor: req.query.ordenarPor,
      ordem: req.query.ordem,
      busca: req.query.busca,
    });
    res.json(resultado);
  } catch (erro) {
    next(erro);
  }
}
```

### Testando no Postman

```
GET /eventos?pagina=1&porPagina=2
→ Retorna 2 eventos por página com metadados

GET /eventos?busca=Workshop
→ Retorna apenas eventos com "Workshop" no nome

GET /eventos?ordenarPor=nome&ordem=DESC
→ Retorna eventos ordenados por nome, Z-A
```

> 💡 Os **query parameters** são os valores depois do `?` na URL. O Express os disponibiliza em `req.query`.

---

## 🔍 Parte 2 — Consultas Avançadas com Sequelize

O Sequelize tem **operadores** para consultas complexas:

```javascript
const { Op } = require('sequelize');

// Busca parcial (LIKE)
{ nome: { [Op.like]: '%node%' } }          // nome LIKE '%node%'

// Maior que
{ capacidade: { [Op.gt]: 50 } }            // capacidade > 50

// Entre valores
{ data: { [Op.between]: ['2025-08-01', '2025-12-31'] } }

// Múltiplos valores
{ status: { [Op.in]: ['confirmada', 'pendente'] } }

// Combinando com AND
{ [Op.and]: [{ capacidade: { [Op.gt]: 30 } }, { local: 'SENAI' }] }
```

### 🧩 Desafio — Endpoint de eventos futuros

Crie uma rota `GET /eventos/futuros` que retorne apenas eventos com data posterior a hoje. Você precisará modificar **três arquivos**:

**1. `src/services/EventoService.js` — adicionar a função e exportá-la:**

```javascript
async function listarFuturos() {
  const { Op } = require("sequelize");

  const eventos = await Evento.findAll({
    where: {
      data: {
        // Que operador usar para buscar datas MAIORES que agora?
        // _________________________________
      },
    },
    order: [["data", "ASC"]],
  });

  return eventos;
}

// Lembre-se de adicionar listarFuturos ao module.exports
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  remover,
  listarFuturos,
};
```

**2. `src/controllers/EventoController.js` — adicionar o método e exportá-lo:**

```javascript
async function listarFuturos(req, res, next) {
  try {
    const eventos = await EventoService.listarFuturos();
    res.json(eventos);
  } catch (erro) {
    next(erro);
  }
}

// Lembre-se de adicionar listarFuturos ao module.exports
module.exports = { index, show, store, update, destroy, listarFuturos };
```

**3. `src/routes/eventoRoutes.js` — registrar a rota:**

```javascript
// ⚠️ Esta linha deve vir ANTES da rota /:id
// senão o Express interpreta "futuros" como um id
router.get("/futuros", EventoController.listarFuturos);
```

> 💡 Dica: `new Date()` retorna a data/hora atual. O operador para "maior que" no Sequelize é `Op.gt`.

---

## 📄 Parte 3 — Exportação em XML

Nem todos os sistemas consomem JSON. Sistemas mais antigos (bancos, governo, ERPs) frequentemente usam **XML**. Vamos criar endpoints que exportam nossos dados nesse formato.

### Instalação

```bash
npm install xmlbuilder2
```

### Criando o endpoint de exportação

Crie `src/routes/exportRoutes.js`:

```javascript
// src/routes/exportRoutes.js
const express = require("express");
const router = express.Router();
const { Evento, Participante, Inscricao } = require("../models");
const { create } = require("xmlbuilder2");

// GET /exportar/eventos/xml — exportar eventos em XML
router.get("/eventos/xml", async (req, res, next) => {
  try {
    const eventos = await Evento.findAll({ order: [["data", "ASC"]] });

    const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("eventos");

    eventos.forEach((evento) => {
      xml
        .ele("evento")
        .ele("id")
        .txt(String(evento.id))
        .up()
        .ele("nome")
        .txt(evento.nome)
        .up()
        .ele("descricao")
        .txt(evento.descricao || "")
        .up()
        .ele("data")
        .txt(evento.data.toISOString())
        .up()
        .ele("local")
        .txt(evento.local || "")
        .up()
        .ele("capacidade")
        .txt(String(evento.capacidade || 0))
        .up()
        .up();
    });

    const xmlString = xml.end({ prettyPrint: true });

    res.set("Content-Type", "application/xml");
    res.send(xmlString);
  } catch (erro) {
    next(erro);
  }
});

// GET /exportar/eventos/json — exportar eventos em JSON (download)
router.get("/eventos/json", async (req, res, next) => {
  try {
    const eventos = await Evento.findAll({
      order: [["data", "ASC"]],
      raw: true,
    });

    res.set("Content-Type", "application/json");
    res.set("Content-Disposition", 'attachment; filename="eventos.json"');
    res.json(eventos);
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
```

### Registrar no app.js

```javascript
const exportRoutes = require("./routes/exportRoutes");
app.use("/exportar", exportRoutes);
```

### Teste no Postman

```
GET /exportar/eventos/xml
```

Resultado:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<eventos>
  <evento>
    <id>1</id>
    <nome>Workshop de Node.js</nome>
    <descricao>Aprenda Node.js do zero</descricao>
    <data>2025-08-15T09:00:00.000Z</data>
    <local>SENAI - Sala 3</local>
    <capacidade>30</capacidade>
  </evento>
  ...
</eventos>
```

### JSON vs XML — Quando usar cada um?

|                  |              JSON              |                  XML                     |
| ---------------- | ------------------------------ | ---------------------------------------- |
| **Tamanho**      | Menor (sem tags de fechamento) | Maior                                    |
| **Legibilidade** | Boa para devs                  | Boa para humanos e máquinas              |
| **Uso moderno**  | APIs REST, front-end, mobile   | Notas fiscais, integrações legadas, SOAP |
| **Parsing**      | Nativo no JavaScript           | Precisa de biblioteca                    |

---

## 🧩 Desafio — Exportar Inscrições com Detalhes

Crie um endpoint `GET /exportar/inscricoes/xml` que exporte as inscrições incluindo dados do evento e participante:

```xml
<inscricoes>
  <inscricao>
    <id>1</id>
    <status>confirmada</status>
    <evento>Workshop de Node.js</evento>
    <participante>
      <nome>Ana Silva</nome>
      <email>ana@email.com</email>
    </participante>
  </inscricao>
</inscricoes>
```

> 💡 Dica: use `Inscricao.findAll({ include: [...] })` para trazer os dados relacionados, depois construa o XML.

---

## ✅ Checklist — Antes de Sair

- [ ] Paginação implementada no GET /eventos (pagina, porPagina, busca, ordenação)
- [ ] Entendi os operadores do Sequelize (Op.like, Op.gt, Op.between)
- [ ] Endpoint GET /exportar/eventos/xml funcionando
- [ ] Endpoint GET /exportar/eventos/json funcionando (download)
- [ ] Endpoint de inscrições em XML (desafio)
- [ ] Rota /exportar registrada no app.js
- [ ] Commit e push

---

> **Próxima aula:** Upload de arquivos com Multer e geração de relatórios!
