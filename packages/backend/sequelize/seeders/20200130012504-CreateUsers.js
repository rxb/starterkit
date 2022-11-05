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
    return queryInterface.bulkInsert('users', [

      {
        "redditId": null,
        "password": "supersecret",
        "facebookId": null,
        "email": "test@example.com",
        "photoId": "1c4f149127c5972bc76b4685c399033fee26f3575fa3d413d07e9b23780ffc35.jpeg",
        "name": "Sally Testperson",
        "googleId": null,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "redditId": null,
        "password": "supersecret",
        "facebookId": null,
        "email": "test2@example.com",
        "photoId": "d8f8788a028e602c00a15e1c732136c754ea5b02978a32170747310cc461c5cd.jpeg",
        "name": "Richard Boenigk",
        "googleId": null,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
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
    return queryInterface.bulkDelete('users', null, {});
  }
};
