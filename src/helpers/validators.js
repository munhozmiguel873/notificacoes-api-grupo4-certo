// src/helpers/validators.js

/**
 * Verifica se um valor existe e não é string vazia
 */
function isRequired(valor, nomeCampo) {
  if (valor === undefined || valor === null) {
    return `${nomeCampo} é obrigatório`;
  }
  if (typeof valor === "string" && valor.trim() === "") {
    return `${nomeCampo} não pode ser vazio`;
  }
  return null; // null = sem erro
}

/**
 * Verifica se é um e-mail válido (validação simples)
 */
function isEmail(valor) {
  if (!valor) return null; // Se não foi enviado, não valida (use isRequired para isso)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(valor)) {
    return "E-mail inválido";
  }
  return null;
}

/**
 * Verifica se é um número inteiro positivo
 */
function isPositiveInteger(valor, nomeCampo) {
  if (valor === undefined || valor === null) return null;
  if (!Number.isInteger(valor) || valor <= 0) {
    return `${nomeCampo} deve ser um número inteiro positivo`;
  }
  return null;
}

/**
 * Verifica se uma string tem tamanho mínimo
 */
function minLength(valor, min, nomeCampo) {
  if (!valor) return null;
  if (typeof valor === "string" && valor.trim().length < min) {
    return `${nomeCampo} deve ter pelo menos ${min} caracteres`;
  }
  return null;
}

/**
 * Executa um array de validações e retorna os erros encontrados
 */
function validar(validacoes) {
  const erros = validacoes.filter((erro) => erro !== null);
  return erros.length > 0 ? erros : null;
}

module.exports = {
  isRequired,
  isEmail,
  isPositiveInteger,
  minLength,
  validar,
};
