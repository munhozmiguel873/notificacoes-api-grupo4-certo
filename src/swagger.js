// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notificações API",
      version: "1.0.0",
      description:
        "API para módulo de notificações por e-mail de uma plataforma de gerenciamento de evento",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    apis: ["./src/routes/*.js"],
  },
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
