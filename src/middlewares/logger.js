// src/middlewares/logger.js

function logger(req, res, next) {
  const dataHora = new Date().toLocaleString("pt-BR");
  const metodo = req.method;
  const url = req.url;

  console.log(`[${dataHora}] ${metodo} ${url}`);

  next();
}

module.exports = logger;
