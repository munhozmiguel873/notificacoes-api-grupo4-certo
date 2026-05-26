# Aula 16 — CRUD com Sequelize: Update e Delete

> **Bloco 3** · Quinta-feira · Semana 8 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Hoje vamos completar o CRUD com Sequelize implementando **Update** e **Delete**. Também vamos migrar o **InscricaoService** para o banco de dados. Ao final, toda a API estará funcionando com persistência real.

**O que você vai produzir hoje:**
- [x] Implementar Update e Delete no EventoService
- [x] Completar o ParticipanteService (se não terminou)
- [x] Migrar o InscricaoService para Sequelize
- [x] CRUD completo de 3 entidades com banco de dados real

---

## 🛠️ Parte 1 — Update e Delete no EventoService

Adicione os métodos que faltam no `EventoService.js`:

```javascript
async function atualizar(id, dados) {
  const evento = await Evento.findByPk(id);

  if (!evento) {
    throw new NotFoundError('Evento');
  }

  try {
    await evento.update(dados);
    return evento;
  } catch (erro) {
    if (erro.name === 'SequelizeValidationError') {
      const mensagens = erro.errors.map(e => e.message).join('; ');
      throw new ValidationError(mensagens);
    }
    throw erro;
  }
}

async function deletar(id) {
  const evento = await Evento.findByPk(id);

  if (!evento) {
    throw new NotFoundError('Evento');
  }

  await evento.destroy();
  return true;
}
```

### Entendendo os métodos

| Método | SQL equivalente | Detalhe |
|---|---|---|
| `evento.update(dados)` | `UPDATE eventos SET ... WHERE id = ?` | Atualiza apenas os campos passados |
| `evento.destroy()` | `DELETE FROM eventos WHERE id = ?` | Remove o registro |

> 💡 Perceba que primeiro buscamos o registro (`findByPk`), depois aplicamos a ação (`update` ou `destroy`). Isso garante que podemos verificar se existe antes de alterar.

### Teste no Postman

```
PUT http://localhost:3000/eventos/1
Body: { "nome": "Workshop de Node.js (Edição Especial)", "capacidade": 50 }
→ 200 com o evento atualizado

DELETE http://localhost:3000/eventos/1
→ 204 No Content

GET http://localhost:3000/eventos/1
→ 404 Evento não encontrado
```

> Reinicie o servidor e confirme: o evento deletado **continua deletado**. Isso é persistência!

---

## 🧩 Parte 2 — Migrar o InscricaoService (desafio em grupo)

O InscricaoService é o mais interessante porque envolve **relacionamentos**. Dividam as tarefas:

### InscricaoService completo — parte guiada + parte para completar:

```javascript
// src/services/InscricaoService.js
const { Inscricao, Evento, Participante } = require('../models');
const { NotFoundError, ValidationError } = require('../errors/AppError');

async function criar(dados) {
  const { eventoId, participanteId } = dados;

  // Verificar se o evento existe
  const evento = await Evento.findByPk(eventoId);
  if (!evento) throw new NotFoundError('Evento');

  // Verificar se o participante existe
  const participante = await Participante.findByPk(participanteId);
  if (!participante) throw new NotFoundError('Participante');

  // Verificar duplicata
  const jaInscrito = await Inscricao.findOne({
    where: { evento_id: eventoId, participante_id: participanteId }
  });
  if (jaInscrito) throw new ValidationError('Participante já inscrito neste evento');

  // Criar a inscrição
  const novaInscricao = await Inscricao.create({
    evento_id: eventoId,
    participante_id: participanteId,
  });

  return novaInscricao;
}

async function listarTodas() {
  // Listar com dados do evento e participante incluídos!
  const inscricoes = await Inscricao.findAll({
    include: [
      { model: Evento, as: 'evento', attributes: ['id', 'nome', 'data'] },
      { model: Participante, as: 'participante', attributes: ['id', 'nome', 'email'] },
    ],
    order: [['created_at', 'DESC']],
  });
  return inscricoes;
}

async function listarPorEvento(eventoId) {
  // Implemente: busque inscrições filtradas por evento_id
  // Inclua os dados do participante (nome e email)
  // _________________________________
  // _________________________________
  // _________________________________
  // _________________________________
  // _________________________________
}

async function cancelar(id) {
  // Implemente: busque a inscrição, se não existir lance NotFoundError
  // Use inscricao.update({ status: 'cancelada' })
  // _________________________________
  // _________________________________
  // _________________________________
  // _________________________________
  // _________________________________
}

module.exports = { criar, listarTodas, listarPorEvento, cancelar };
```

### O poder do `include`

O `include` do Sequelize faz **JOINs** automaticamente. Quando listamos inscrições com include, a resposta vem assim:

```json
{
  "id": 1,
  "status": "confirmada",
  "data_inscricao": "2025-08-01T...",
  "evento": {
    "id": 1,
    "nome": "Workshop de Node.js",
    "data": "2025-08-15T..."
  },
  "participante": {
    "id": 1,
    "nome": "Ana Silva",
    "email": "ana@email.com"
  }
}
```

> Lembram do desafio extra da Aula 04 (montar resposta com dados completos)? Com Sequelize, isso vem "de graça" com `include`!

### Atualize o InscricaoController

Não esqueça de tornar todos os métodos `async` e adicionar `await`:

```javascript
// src/controllers/InscricaoController.js
const InscricaoService = require('../services/InscricaoService');

async function store(req, res, next) {
  try {
    const novaInscricao = await InscricaoService.criar(req.body);
    res.status(201).json(novaInscricao);
  } catch (erro) {
    next(erro);
  }
}

async function index(req, res, next) {
  try {
    const inscricoes = await InscricaoService.listarTodas();
    res.json(inscricoes);
  } catch (erro) {
    next(erro);
  }
}

// Complete listarPorEvento e cancelar seguindo o mesmo padrão
// _________________________________
// _________________________________

module.exports = { store, index, listarPorEvento, cancelar };
```

---

## 🧪 Parte 3 — Teste Integrado

Façam este roteiro de testes completo no Postman para garantir que tudo funciona:

| # | Ação | Esperado |
|---|---|---|
| 1 | `GET /eventos` | Lista os eventos do seed |
| 2 | `POST /eventos` (dados válidos) | 201, evento criado com ID |
| 3 | `PUT /eventos/:id` | 200, evento atualizado |
| 4 | `GET /participantes` | Lista os participantes do seed |
| 5 | `POST /inscricoes` (evento 2, participante 1) | 201, inscrição criada |
| 6 | `POST /inscricoes` (mesmo combo) | 400, "já inscrito" |
| 7 | `GET /inscricoes` | Lista com dados de evento e participante |
| 8 | `PATCH /inscricoes/:id/cancelar` | 200, status "cancelada" |
| 9 | **Reiniciar servidor** | — |
| 10 | `GET /eventos` | Dados persistem! |
| 11 | `DELETE /eventos/:id` | 204 |
| 12 | `GET /inscricoes` | Inscrições do evento deletado devem ter sumido (CASCADE) |

> ✅ Se todos os 12 testes passaram, o CRUD completo com banco de dados está funcionando!

---

## ✅ Checklist — Antes de Sair

- [ ] Update e Delete implementados no EventoService
- [ ] ParticipanteService completo com Sequelize (todos os 5 métodos)
- [ ] InscricaoService migrado para Sequelize com include
- [ ] Todos os Controllers atualizados com async/await
- [ ] errorHandler trata erros do Sequelize (validação, unique, FK)
- [ ] Testes integrados passando no Postman
- [ ] Dados persistem após reinício do servidor
- [ ] CASCADE funciona (deletar evento remove inscrições)
- [ ] Commit e push

---

> **Próxima aula:** Manipulação de dados JSON e exportação em XML — formatando os dados da API de formas diferentes.
