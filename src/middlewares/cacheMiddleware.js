// src/middlewares/cacheMiddleware.js
const cache = require("../config/cache");

function cacheMiddleware(duracaoSegundos) {
  return (req, res, next) => {
    // Só cachear requisições GET
    if (req.method !== "GET") {
      return next();
    }

    const chave = req.originalUrl;
    const dadosCache = cache.get(chave);

    if (dadosCache) {
      console.log(`[CACHE HIT] ${chave}`);
      return res.json(dadosCache);
    }

    // Sobrescrever res.json para interceptar a resposta
    const jsonOriginal = res.json.bind(res);
    res.json = (dados) => {
      cache.set(chave, dados, duracaoSegundos);
      console.log(`[CACHE MISS] ${chave} — armazenado por ${duracaoSegundos}s`);
      jsonOriginal(dados);
    };

    next();
  };
}

module.exports = cacheMiddleware;
