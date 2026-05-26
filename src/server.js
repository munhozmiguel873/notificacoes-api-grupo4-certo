// src/server.js
require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");
const EmailService = require("./services/EmailService");

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL estabelecida com sucesso!");
    //Inicializar o serviço de e-mail (cria conta de teste e transporter)
    await EmailService.inicializar();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar:", erro.message);
    process.exit(1);
  }
}

iniciar();
