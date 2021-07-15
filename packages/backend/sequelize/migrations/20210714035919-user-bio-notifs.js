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
      'users', 'bio', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn(
      'users', 'link', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn(
      'users', 'notifyOwnedIssues', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
    await queryInterface.addColumn(
      'users', 'notifyParticipatedIssues', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'link');
    await queryInterface.removeColumn('users', 'notifyOwnedIssues');
    await queryInterface.removeColumn('users', 'notifyParticipatedIssues');

  }
};
