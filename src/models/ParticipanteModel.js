// src/models/ParticipanteModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Participante = sequelize.define(
  "Participante",
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
        len: { args: [2, 255], msg: "Nome deve ter entre 2 e 255 caracteres" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "E-mail inválido" },
        notEmpty: { msg: "E-mail não pode ser vazio" },
      },
    },
  },
  {
    tableName: "participantes",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Participante;
