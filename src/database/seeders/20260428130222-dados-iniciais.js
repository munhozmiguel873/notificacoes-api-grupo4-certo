"use strict";

module.exports = {
  async up(queryInterface) {
    // Inserir eventos
    await queryInterface.bulkInsert("eventos", [
      {
        nome: "Workshop de Node.js",
        descricao: "Aprenda Node.js do zero",
        data: "2025-08-15 09:00:00",
        local: "SENAI - Sala 3",
        capacidade: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Hackathon SENAI 2025",
        descricao: "Maratona de programação",
        data: "2025-09-20 08:00:00",
        local: "SENAI - Auditório",
        capacidade: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Palestra sobre APIs REST",
        descricao: "Como construir APIs profissionais",
        data: "2025-10-10 14:00:00",
        local: "SENAI - Sala 5",
        capacidade: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Inserir participantes
    await queryInterface.bulkInsert("participantes", [
      {
        nome: "Ana Silva",
        email: "ana@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Carlos Souza",
        email: "carlos@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: "Maria Santos",
        email: "maria@email.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Inserir inscrições
    await queryInterface.bulkInsert("inscricoes", [
      {
        evento_id: 1,
        participante_id: 1,
        data_inscricao: new Date(),
        status: "confirmada",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        evento_id: 1,
        participante_id: 2,
        data_inscricao: new Date(),
        status: "confirmada",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        evento_id: 2,
        participante_id: 3,
        data_inscricao: new Date(),
        status: "confirmada",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("inscricoes", null, {});
    await queryInterface.bulkDelete("participantes", null, {});
    await queryInterface.bulkDelete("eventos", null, {});
  },
};
