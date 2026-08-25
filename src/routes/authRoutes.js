// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/registrar", AuthController.registrar);
router.post("/login", AuthController.login);

module.exports = router;