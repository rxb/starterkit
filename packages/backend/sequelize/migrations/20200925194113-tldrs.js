'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tldrs', // table name
      'draftContent', // new field name
      {
        type: Sequelize.JSONB
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tldrs', 'draftContent')
  }
};
