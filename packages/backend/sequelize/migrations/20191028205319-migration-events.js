'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
        'events',
        'sourceData',
        {
          type: Sequelize.JSONB,
        }
      ),
      queryInterface.addColumn(
        'events',
        'startDate',
        {
          type: Sequelize.DATE,
        }
      )
    ];
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
