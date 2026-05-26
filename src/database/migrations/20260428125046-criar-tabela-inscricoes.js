"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inscricoes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      evento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "eventos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      participante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "participantes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      data_inscricao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      status: {
        type: Sequelize.ENUM("confirmada", "cancelada"),
        allowNull: false,
        defaultValue: "confirmada",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inscricoes");
  },
};
