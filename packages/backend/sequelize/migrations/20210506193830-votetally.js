'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn(
      'tldrs', 'voteQuantity', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      });
      await queryInterface.addColumn(
        'tldrs', 'voteResult', {
          type: Sequelize.INTEGER,
          defaultValue: 0
      });
      await queryInterface.addColumn(
        'tldrs', 'votePositivity', {
          type: Sequelize.INTEGER,
          defaultValue: 0
      });      
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
