// src/events/logObserver.js
appEmitter.on("inscricao:criada", (inscricao) => {
  const fs = require("fs");
  const linha = `[${new Date().toISOString()}] Inscrição #${inscricao.id} criada\n`;
  fs.appendFileSync("logs/app.log", linha);
});
