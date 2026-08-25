// src/models/UsuarioModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = sequelize.define(
    "Usuario",
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
                notEmpty: { msg: "Nome é obrigatório" },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: "E-mail inválido" },
            },
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false, // hash bcrypt, nunca texto puro
        },
    },
    {
        tableName: "usuarios",
        timestamps: true,
        underscored: true,
    },
);
module.exports = Usuario;