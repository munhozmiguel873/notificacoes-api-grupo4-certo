// src/routes/exportRoutes.js
const express = require("express");
const router = express.Router();
const { Evento, Participante, Inscricao } = require("../models");
const { create } = require("xmlbuilder2");

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
 *
 *     Inscricao:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         eventoId:
 *           type: integer
 *         participanteId:
 *           type: integer
 *         status:
 *           type: string
 *           example: "confirmado"
 *         dataInscricao:
 *           type: string
 *           format: date-time
 *
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
 *
 *     RelatorioInscricoes:
 *       type: object
 *       properties:
 *         geradoEm:
 *           type: string
 *           format: date-time
 *           example: "2026-06-02T12:54:10.000Z"
 *         totalEventos:
 *           type: integer
 *           example: 1
 *         relatorio:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               evento:
 *                 type: string
 *                 example: "Workshop de Node.js"
 *               data:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-15T00:00:00.000Z"
 *               capacidade:
 *                 type: integer
 *                 example: 30
 *               totalInscritos:
 *                 type: integer
 *                 example: 1
 *               vagasRestantes:
 *                 type: integer
 *                 example: 29
 *               inscritos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       example: "João Silva"
 *                     email:
 *                       type: string
 *                       example: "joao@email.com"
 *                     status:
 *                       type: string
 *                       example: "confirmado"
 *                     dataInscricao:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-02T10:00:00.000Z"
 */

// GET /exportar/eventos/xml — exportar eventos em XML
/**
 * @swagger
 * /exportar/eventos/xml:
 *   get:
 *     summary: Exportar eventos em XML
 *     tags: [Exportação]
 *     responses:
 *       200:
 *         description: Arquivo XML contendo a lista de eventos
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/xml
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *               example: |
 *                 <?xml version="1.0" encoding="UTF-8"?>
 *                 <eventos>
 *                   <evento>
 *                     <id>1</id>
 *                     <nome>Workshop de Node.js</nome>
 *                     <descricao>Aprenda Node.js do zero</descricao>
 *                     <data>2025-08-15T00:00:00.000Z</data>
 *                     <local>SENAI - Sala 3</local>
 *                     <capacidade>30</capacidade>
 *                   </evento>
 *                 </eventos>
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */

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
/**
 * @swagger
 * /exportar/eventos/json:
 *   get:
 *     summary: Exportar eventos em JSON (Download)
 *     tags: [Exportação]
 *     responses:
 *       200:
 *         description: Arquivo JSON contendo a lista de eventos para download
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="eventos.json"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */

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

// GET /exportar/inscricoes/xml — exportar inscrições em XML
/**
 * @swagger
 * /exportar/inscricoes/xml:
 *   get:
 *     summary: Exportar inscrições em XML
 *     tags: [Exportação]
 *     responses:
 *       200:
 *         description: Arquivo XML contendo a lista de inscrições
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/xml
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 *               example: |
 *                 <?xml version="1.0" encoding="UTF-8"?>
 *                 <inscricoes>
 *                   <inscricao>
 *                     <id>1</id>
 *                     <evento>Workshop de Node.js</evento>
 *                     <participante>João Silva</participante>
 *                     <dataInscricao>2026-06-02T10:00:00.000Z</dataInscricao>
 *                   </inscricao>
 *                 </inscricoes>
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */

router.get("/inscricoes/xml", async (req, res, next) => {
  try {
    const inscricoes = await Inscricao.findAll({
      include: [
        { model: Evento, as: "evento", attributes: ["id", "nome"] },
        { model: Participante, as: "participante", attributes: ["id", "nome"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("inscricoes");

    inscricoes.forEach((inscricao) => {
      xml
        .ele("inscricao")
        .ele("id")
        .txt(String(inscricao.id))
        .up()
        .ele("evento")
        .txt(inscricao.evento.nome)
        .up()
        .ele("participante")
        .txt(inscricao.participante.nome)
        .up()
        .ele("dataInscricao")
        .txt(inscricao.createdAt.toISOString())
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


// GET /exportar/relatorio/inscricoes — relatório de inscrições por evento
/**
 * @swagger
 * /exportar/relatorio/inscricoes:
 *   get:
 *     summary: Relatório de inscrições por evento
 *     tags: [Exportação]
 *     responses:
 *       200:
 *         description: Objeto JSON contendo métricas e lista de inscritos por evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RelatorioInscricoes'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */

router.get("/relatorio/inscricoes", async (req, res, next) => {
  try {
    const eventos = await Evento.findAll({
      include: [
        {
          model: Inscricao,
          as: "inscricoes",
          include: [
            {
              model: Participante,
              as: "participante",
              attributes: ["nome", "email"],
            },
          ],
        },
      ],
      order: [["data", "ASC"]],
    });

    // Formatar o relatório
    const relatorio = eventos.map((evento) => ({
      evento: evento.nome,
      data: evento.data,
      capacidade: evento.capacidade,
      totalInscritos: evento.inscricoes.length,
      vagasRestantes: (evento.capacidade || 0) - evento.inscricoes.length,
      inscritos: evento.inscricoes.map((i) => ({
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

// GET /exportar/relatorio/inscricoes/csv
/**
 * @swagger
 * /exportar/relatorio/inscricoes/csv:
 *   get:
 *     summary: Relatório de inscrições por evento em CSV (Download)
 *     tags: [Exportação]
 *     responses:
 *       200:
 *         description: Arquivo CSV contendo a planilha de inscrições para download
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="inscricoes.csv"
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 ID,Evento,Data Evento,Participante,Email,Status,Data Inscricao
 *                 1,"Workshop de Node.js",2025-08-15T00:00:00.000Z,"João Silva",joao@email.com,confirmado,2026-06-02T10:00:00.000Z
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */

router.get("/relatorio/inscricoes/csv", async (req, res, next) => {
  try {
    const inscricoes = await Inscricao.findAll({
      include: [
        { model: Evento, as: "evento", attributes: ["nome", "data"] },
        {
          model: Participante,
          as: "participante",
          attributes: ["nome", "email"],
        },
      ],
      raw: true,
      nest: true,
    });

    // Montar o cabeçalho do CSV
    let csv =
      "ID,Evento,Data Evento,Participante,Email,Status,Data Inscricao\n";

    // Montar as linhas
    inscricoes.forEach((i) => {
      // Complete: monte cada linha do CSV separando por vírgula
      // Dica: use template literals e acesse i.evento.nome, i.participante.email, etc.
      csv += `${i.id},"${i.evento.nome}",${i.evento.data.toISOString()},"${i.participante.nome}",${i.participante.email},${i.status},${i.createdAt.toISOString()}\n`;
    });

    res.set("Content-Type", "text/csv");
    res.set("Content-Disposition", 'attachment; filename="inscricoes.csv"');
    res.send(csv);
  } catch (erro) {
    next(erro);
  }
});


module.exports = router;