// src/routes/eventoRoutes.js
const express = require("express");
const router = express.Router();
const EventoController = require("../controllers/EventoController");
const upload = require("../config/upload");
const cacheMiddleware = require("../middlewares/cacheMiddleware");

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
 */

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Listar todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.get("/", cacheMiddleware(30), EventoController.index);

/**
 * @swagger
 * /eventos/futuros:
 *   get:
 *     summary: Listar eventos futuros
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos futuros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.get("/futuros", cacheMiddleware(30), EventoController.listarFuturos);

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Buscar evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Evento não encontrado
 */
router.get("/:id", cacheMiddleware(30), EventoController.show);

/**
 * @swagger
 * /eventos:
 *   post:
 *     summary: Criar um novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - data
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               data:
 *                 type: string
 *               local:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *           example:
 *             nome: "Palestra sobre APIs"
 *             descricao: "Como construir APIs profissionais"
 *             data: "2025-10-10"
 *             local: "SENAI - Sala 5"
 *             capacidade: 50
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", EventoController.store);

// POST /eventos/:id/banner — enviar imagem do banner
router.post("/:id/banner", upload.single("banner"), async (req, res, next) => {
  try {
    const { Evento } = require("../models");
    const evento = await Evento.findByPk(req.params.id);

    if (!evento) {
      return res.status(404).json({ erro: "Evento não encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({ erro: "Nenhum arquivo enviado" });
    }

    // Salvar o caminho do arquivo no banco
    await evento.update({ banner: `/uploads/${req.file.filename}` });

    res.json({
      mensagem: "Banner atualizado com sucesso",
      banner: `/uploads/${req.file.filename}`,
    });
  } catch (erro) {
    next(erro);
  }
});

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Atualizar um evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               data:
 *                 type: string
 *               local:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       404:
 *         description: Evento não encontrado
 */
router.put("/:id", EventoController.update);

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Deletar um evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Evento deletado
 *       404:
 *         description: Evento não encontrado
 */
router.delete("/:id", EventoController.destroy);

module.exports = router;
