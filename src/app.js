// src/app.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");

require("./events/notificacaoObserver");

const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const responseTime = require("./middlewares/responseTime");
app.use(responseTime);

// ============================================
// DOCUMENTAÇÃO
// ============================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// ROTAS
// ============================================
const eventoRoutes = require("./routes/eventoRoutes");
const participanteRoutes = require("./routes/participanteRoutes");
const inscricaoRoutes = require("./routes/inscricaoRoutes");
const exportRoutes = require("./routes/exportRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");

app.use("/eventos", eventoRoutes);
app.use("/participantes", participanteRoutes);
app.use("/inscricoes", inscricaoRoutes);
app.use("/exportar", exportRoutes);
app.use("/notificacoes", notificacaoRoutes);

// Rota raiz (informativa)
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Notificações",
    versao: "1.0.0",
    documentacao: "/api-docs",
    rotas: {
      eventos: "/eventos",
      participantes: "/participantes",
      inscricoes: "/inscricoes",
    },
  });
});

// ============================================
// MIDDLEWARES DE ERRO (sempre por último!)
// ============================================
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

app.use(notFound);
app.use(errorHandler);

module.exports = app;
