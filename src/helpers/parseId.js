// src/helpers/parseId.js
const { ValidationError } = require("../errors/AppError");

function parseId(valor) {
  const id = parseInt(valor);
  if (isNaN(id)) {
    throw new ValidationError("ID deve ser um número válido");
  }
  return id;
}

module.exports = parseId;
