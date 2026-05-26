// src/config/upload.js
const multer = require("multer");
const path = require("path");

// Configurar onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + extensão original
    const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extensao = path.extname(file.originalname);
    cb(null, nomeUnico + extensao);
  },
});

// Filtrar tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true); // aceita
  } else {
    cb(
      new Error("Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP"),
      false,
    );
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
