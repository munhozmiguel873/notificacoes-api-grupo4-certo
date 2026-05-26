// src/routes/inscricaoRoutes.js
const express = require("express");
const router = express.Router();
const InscricaoController = require("../controllers/InscricaoController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Inscricao:
 *       type: object
 *       required:
 *         - participanteId
 *         - eventoId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID gerado automaticamente
 *         participanteId:
 *           type: integer
 *           description: ID do participante
 *         eventoId:
 *           type: integer
 *           description: ID do evento
 *         status:
 *           type: string
 *           description: Status da inscrição (ativa, cancelada)
 *       example:
 *         id: 1
 *         participanteId: 1
 *         eventoId: 1
 *         status: ativa
 */

/**
 * @swagger
 * /inscricoes:
 *   get:
 *     summary: Listar todas as inscrições
 *     tags: [Inscrições]
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscricao'
 */
router.get("/", InscricaoController.index);

/**
 * @swagger
 * /inscricoes:
 *   post:
 *     summary: Criar uma nova inscrição
 *     tags: [Inscrições]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participanteId
 *               - eventoId
 *             properties:
 *               participanteId:
 *                 type: integer
 *                 description: ID do participante
 *               eventoId:
 *                 type: integer
 *                 description: ID do evento
 *             example:
 *               participanteId: 1
 *               eventoId: 1
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscricao'
 *       400:
 *         description: Dados inválidos (eventoId e participanteId são obrigatórios)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *               example:
 *                 erro: "eventoId e participanteId são obrigatórios"
 */
router.post("/", InscricaoController.store);

/**
 * @swagger
 * /inscricoes/evento/{eventoId}:
 *   get:
 *     summary: Listar inscrições por ID do evento
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Lista de inscrições para o evento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscricao'
 */
router.get("/evento/:eventoId", InscricaoController.listarPorEvento);

/**
 * @swagger
 * /inscricoes/{id}/cancelar:
 *   patch:
 *     summary: Cancelar uma inscrição
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da inscrição a ser cancelada
 *     responses:
 *       200:
 *         description: Inscrição cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscricao'
 *       404:
 *         description: Inscrição não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *               example:
 *                 erro: "Inscrição não encontrada"
 */
router.patch("/:id/cancelar", InscricaoController.cancelar);

module.exports = router;
