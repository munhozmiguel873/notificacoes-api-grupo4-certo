const AuthService = require("../services/AuthService");

async function registrar(req, res, next) {
    try {
        const usuario = await AuthService.registrar(req.body);
        res.status(201).json(usuario);
    } catch (erro) {
        next(erro);
    }
}

async function login(req, res, next) {
    try {
        const { email, senha } = req.body;
        const resultado = await AuthService.login(email, senha);
        res.json(resultado);
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    registrar,
    login
};