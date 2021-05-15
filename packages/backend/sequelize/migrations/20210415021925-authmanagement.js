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
      'users', 'isVerified', {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn(
      'users', 'verifyToken', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(
      'users', 'verifyShortToken', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(
      'users', 'verifyExpires', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn(
      'users', 'verifyChanges', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(
      'users', 'resetToken', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(
      'users', 'resetShortToken', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(
      'users', 'resetExpires', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn(
      'users', 'resetAttempts', {
      type: Sequelize.INTEGER,
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
