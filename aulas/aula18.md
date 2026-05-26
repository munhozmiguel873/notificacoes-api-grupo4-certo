# Aula 18 — Upload de Arquivos + Geração de Relatórios

> **Bloco 3** · Quinta-feira · Semana 9 · 3 aulas (135 min)

---

## 🎯 Objetivo da Aula

Hoje vamos implementar duas funcionalidades importantes: **upload de arquivos** (ex: imagem do banner de um evento) e **geração de relatórios** em JSON/CSV. Essas são habilidades que aparecem em praticamente todo sistema real.

**O que você vai produzir hoje:**
- [x] Configurar o Multer para upload de arquivos
- [x] Criar endpoint de upload de imagem para eventos
- [x] Gerar relatório de inscrições em JSON e CSV

---

## 📁 Parte 1 — Upload de Arquivos com Multer

O **Multer** é o middleware mais usado para upload de arquivos no Express. Ele lida com formulários `multipart/form-data`.

### Instalação

```bash
npm install multer
```

### Configuração

Crie `src/config/upload.js`:

```javascript
// src/config/upload.js
const multer = require('multer');
const path = require('path');

// Configurar onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + extensão original
    const nomeUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extensao = path.extname(file.originalname);
    cb(null, nomeUnico + extensao);
  },
});

// Filtrar tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true); // aceita
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // máximo 5MB
  },
});

module.exports = upload;
```

### Criar a pasta de uploads

```bash
mkdir uploads
```

Adicione ao `.gitignore`:

```
uploads/
```

> ⚠️ Arquivos enviados por usuários **nunca** devem ir para o Git!

### Servir arquivos estáticos

No `app.js`, adicione:

```javascript
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
```

Isso permite acessar os arquivos enviados via URL: `http://localhost:3000/uploads/nome-do-arquivo.jpg`

---

## 🖼️ Parte 2 — Endpoint de Upload

Vamos criar uma rota para enviar uma imagem de banner para um evento.

Primeiro, adicione o campo `banner` ao Model de Evento (e crie uma migration):

```bash
npx sequelize-cli migration:generate --name adicionar-banner-eventos
```

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('eventos', 'banner', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'capacidade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('eventos', 'banner');
  },
};
```

Execute a migration:

```bash
npm run db:migrate
```

Atualize o `EventoModel.js` — adicione o campo `banner`:

```javascript
banner: {
  type: DataTypes.STRING,
  allowNull: true,
},
```

Agora, adicione a rota de upload no `eventoRoutes.js`:

```javascript
const upload = require('../config/upload');

// POST /eventos/:id/banner — enviar imagem do banner
router.post('/:id/banner', upload.single('banner'), async (req, res, next) => {
  try {
    const { Evento } = require('../models');
    const evento = await Evento.findByPk(req.params.id);

    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado' });
    }

    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    // Salvar o caminho do arquivo no banco
    await evento.update({ banner: `/uploads/${req.file.filename}` });

    res.json({
      mensagem: 'Banner atualizado com sucesso',
      banner: `/uploads/${req.file.filename}`,
    });
  } catch (erro) {
    next(erro);
  }
});
```

### Testando no Postman

1. Selecione o método **POST** e a URL `http://localhost:3000/eventos/1/banner`
2. Na aba **Body**, escolha **form-data**
3. Adicione um campo com:
   - Key: `banner` (tipo: **File**)
   - Value: selecione uma imagem do seu computador
4. Clique **Send**

Resposta esperada:

```json
{
  "mensagem": "Banner atualizado com sucesso",
  "banner": "/uploads/1693456789-123456789.jpg"
}
```

Acesse `http://localhost:3000/uploads/nome-do-arquivo.jpg` no navegador para ver a imagem.

---

## 📊 Parte 3 — Geração de Relatórios

Vamos criar endpoints que geram relatórios úteis a partir dos dados do banco.

### Relatório: Inscrições por Evento

Adicione ao `exportRoutes.js`:

```javascript
// GET /exportar/relatorio/inscricoes — relatório de inscrições por evento
router.get('/relatorio/inscricoes', async (req, res, next) => {
  try {
    const eventos = await Evento.findAll({
      include: [{
        model: Inscricao,
        as: 'inscricoes',
        include: [{
          model: Participante,
          as: 'participante',
          attributes: ['nome', 'email'],
        }],
      }],
      order: [['data', 'ASC']],
    });

    // Formatar o relatório
    const relatorio = eventos.map(evento => ({
      evento: evento.nome,
      data: evento.data,
      capacidade: evento.capacidade,
      totalInscritos: evento.inscricoes.length,
      vagasRestantes: (evento.capacidade || 0) - evento.inscricoes.length,
      inscritos: evento.inscricoes.map(i => ({
        nome: i.participante.nome,
        email: i.participante.email,
        status: i.status,
        dataInscricao: i.dataInscricao,
      })),
    }));

    res.json({
      geradoEm: new Date().toISOString(),
      totalEventos: relatorio.length,
      relatorio,
    });
  } catch (erro) {
    next(erro);
  }
});
```

### 🧩 Desafio — Exportar relatório em CSV

O formato CSV (Comma-Separated Values) é perfeito para abrir no Excel. Crie um endpoint `GET /exportar/relatorio/inscricoes/csv`:

```javascript
// GET /exportar/relatorio/inscricoes/csv
router.get('/relatorio/inscricoes/csv', async (req, res, next) => {
  try {
    const inscricoes = await Inscricao.findAll({
      include: [
        { model: Evento, as: 'evento', attributes: ['nome', 'data'] },
        { model: Participante, as: 'participante', attributes: ['nome', 'email'] },
      ],
      raw: true,
      nest: true,
    });

    // Montar o cabeçalho do CSV
    let csv = 'ID,Evento,Data Evento,Participante,Email,Status,Data Inscricao\n';

    // Montar as linhas
    inscricoes.forEach(i => {
      // Complete: monte cada linha do CSV separando por vírgula
      // Dica: use template literals e acesse i.evento.nome, i.participante.email, etc.
      // _________________________________
    });

    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename="inscricoes.csv"');
    res.send(csv);
  } catch (erro) {
    next(erro);
  }
});
```

> 💡 O `Content-Disposition: attachment` faz o navegador **baixar** o arquivo em vez de exibir na tela.

---

## ✅ Checklist — Antes de Sair

- [ ] Multer instalado e configurado
- [ ] Pasta `uploads/` criada e no `.gitignore`
- [ ] Migration para campo `banner` criada e executada
- [ ] Endpoint POST /eventos/:id/banner funcionando (testado com imagem)
- [ ] Arquivos estáticos servidos em /uploads/
- [ ] Relatório de inscrições em JSON funcionando
- [ ] Relatório em CSV (desafio)
- [ ] Commit e push

---

> **Próxima aula:** Cache em memória e consolidação de toda a persistência.
