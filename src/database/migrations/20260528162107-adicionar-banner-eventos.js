"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("eventos", "banner", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "capacidade",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("eventos", "banner");
  },
};
