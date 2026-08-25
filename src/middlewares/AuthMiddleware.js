// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/AppError");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Token não fornecido"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = payload.id;
        next();
    } catch (erro) {
        next(new UnauthorizedError("Token inválido ou expirado"));
    }
}

module.exports = authMiddleware;