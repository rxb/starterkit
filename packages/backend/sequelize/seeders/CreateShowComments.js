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
        "body" : "Let's do this",
        "showId" : 1,
        "authorId" : 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Hello I am rando",
        "showId" : 1,
        "authorId" : 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Here I go commenting",
        "showId" : 2,
        "authorId" : 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Let's do some more comments",
        "showId" : 2,
        "authorId" : 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Hey my name is rando",
        "showId" : 3,
        "authorId" : 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Hello how are you",
        "showId" : 3,
        "authorId" : 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Optimistic posting bam!",
        "showId" : 4,
        "authorId" : 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "This is a comment",
        "showId" : 4,
        "authorId" : 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "Here we go!",
        "showId" : 1,
        "authorId" : 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        "body" : "dsljfkdls",
        "showId" : 2,
        "authorId" : 2,
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
    return queryInterface.bulkDelete('ShowComments', null, {});
  }
};
