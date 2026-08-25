// src/errors/AppError.js

class AppError extends Error {
  constructor(mensagem, statusCode) {
    super(mensagem);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundError extends AppError {
  constructor(recurso = "Recurso") {
    super(`${recurso} não encontrado(a)`, 404);
    this.name = "NotFoundError";
  }
}

class ValidationError extends AppError {
  constructor(mensagem) {
    super(mensagem, 400);
    this.name = "ValidationError";
  }
}

class UnauthorizedError extends AppError {
  constructor(mensagem = "Não autorizado") {
    super(mensagem, 401);
    this.name = "UnauthorizedError";
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
};
