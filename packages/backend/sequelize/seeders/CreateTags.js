'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('ShowComments', [
      {
        "label" : "Sitcom",
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "label" : "Documentary",
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "label" : "Reality Show",
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }

      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('ShowComments', null, {});
  }
};
