'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('users', 'urlkey', 'urlKey');
    await queryInterface.renameColumn('tldrs', 'urlkey', 'urlKey');
    await queryInterface.changeColumn(
      'users', 'urlKey',{
        allowNull: false,
      });
    await queryInterface.changeColumn(
      'tldrs', 'urlKey',{
        allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('users', 'urlKey', 'urlkey');
    await queryInterface.renameColumn('tldrs', 'urlKey', 'urlkey');
    await queryInterface.changeColumn(
      'users', 'urlkey',{
        allowNull: true,
      });
    await queryInterface.changeColumn(
      'tldrs', 'urlkey',{
        allowNull: true,
      });    
  }
};
