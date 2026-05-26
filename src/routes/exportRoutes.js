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
