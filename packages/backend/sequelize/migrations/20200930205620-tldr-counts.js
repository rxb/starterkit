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
      'tldrs', 'forkCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn(
      'tldrs', 'issueCount', {
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
    await queryInterface.removeColumn('tldrs', 'forkCount');
    await queryInterface.removeColumn('tldrs', 'issueCount');

  }
};
