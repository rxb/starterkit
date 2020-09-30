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
      'tldrs', 'urlKey', {
        type: Sequelize.TEXT,
        unique : true
      });
    await queryInterface.addColumn(
      'tldrs', 'versionsUsedCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });   
    await queryInterface.addColumn(
      'tldr_versions', 'version', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });   
    await queryInterface.removeColumn('tldr_versions', 'versionName'); 
    await queryInterface.addColumn(
      'users', 'urlKey', {
        type: Sequelize.TEXT,
        unique : true
      });              
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('tldrs', 'urlkey');
    await queryInterface.removeColumn('tldrs', 'versionsUsedCount');
    await queryInterface.removeColumn('tldr_versions', 'version');
    await queryInterface.removeColumn('users', 'urlkey');
  }
};
