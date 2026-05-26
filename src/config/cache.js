// src/config/cache.js
const NodeCache = require("node-cache");

// stdTTL: tempo de vida padrão em segundos (60 = 1 minuto)
// checkperiod: intervalo para verificar itens expirados
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

module.exports = cache;
