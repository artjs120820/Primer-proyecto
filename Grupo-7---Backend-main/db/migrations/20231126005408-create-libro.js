'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('libros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formato: {
        type: Sequelize.STRING
      },
      autor: {
        type: Sequelize.STRING
      },
      editorial: {
        type: Sequelize.STRING
      },
      categoria: {
        type: Sequelize.STRING
      },
      anio: {
        type: Sequelize.STRING
      },
      idioma: {
        type: Sequelize.STRING
      },
      nro_paginas: {
        type: Sequelize.STRING
      },
      encuadernacion: {
        type: Sequelize.STRING
      },
      isbn: {
        type: Sequelize.STRING
      },
      isbn13: {
        type: Sequelize.STRING
      },
      nro_edicion: {
        type: Sequelize.STRING
      },
      imagen_portada_url: {
        type: Sequelize.TEXT
      },
      titulo: {
        type: Sequelize.STRING
      },
      dimensiones: {
        type: Sequelize.STRING
      },
      url_compra: {
        type: Sequelize.TEXT
      },
      tema: {
        type: Sequelize.STRING
      },
      coleccion: {
        type: Sequelize.STRING
      },
      peso: {
        type: Sequelize.STRING
      },
      ilustracion: {
        type: Sequelize.STRING
      },
      disponibilidad_libro: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('libros');
  }
};