'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn(
      'users', 'urlKey',{
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      });
    await queryInterface.changeColumn(
      'tldrs', 'urlKey',{
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn(
      'users', 'urlKey',{
        allowNull: true,
        unique: false
      });
    await queryInterface.changeColumn(
      'tldrs', 'urlKey',{
        allowNull: true,
        unique: false
      });    
  }
};
