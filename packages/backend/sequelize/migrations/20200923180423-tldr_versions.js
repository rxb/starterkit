'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('tldr_versions', {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        content: {
          type: Sequelize.JSONB
        },
        versionName: {
          type: Sequelize.STRING
        },
        tldrId: {
          type: Sequelize.INTEGER
        }
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tldr_versions');
  }
};