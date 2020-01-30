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
        "tagId" : 5,
        "showId" : 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "tagId" : 3,
        "showId" : 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "tagId" : 4,
        "showId" : 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "tagId" : 3,
        "showId" : 3,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "tagId" : 4,
        "showId" : 3,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "tagId" : 4,
        "showId" : 4,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        "tagId" : 5,
        "showId" : 4,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
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
