// src/models/EventoModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Evento = sequelize.define(
  "Evento",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nome não pode ser vazio" },
        len: { args: [3, 255], msg: "Nome deve ter entre 3 e 255 caracteres" },
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    local: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [1], msg: "Capacidade deve ser pelo menos 1" },
      },
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "eventos",
    timestamps: true, // cria createdAt e updatedAt automaticamente
    underscored: true, // usa snake_case nas colunas (created_at em vez de createdAt)
  },
);

module.exports = Evento;
