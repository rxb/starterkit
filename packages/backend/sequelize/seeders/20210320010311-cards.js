'use strict';

const loremIpsum = require("lorem-ipsum").loremIpsum;

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

const defaultSteps = [{"body": "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "head": "Excepteur sint occaecat cupidatat", "note": "Well here we are with a note"}, {"body": "sed do eiusmod tempor incididunt ut labore Okay lets go", "head": "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "note": "Well here we are with a note"}, {"body": "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. sed do eiusmod tempor incididunt ut labore Okay lets go", "head": "Excepteur sint occaecat cupidatat", "note": "Well here we are with a note"}, {"body": "sed do eiusmod tempor incididunt ut labore Okay lets go", "head": "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "note": "Well here we are with a note"}, {"body": "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "head": "Excepteur sint occaecat cupidatat", "note": "Well here we are with a note"}];


module.exports = {
  up: async (queryInterface, Sequelize) => {

    const authorId = 2;

    // ####
    // fetch categories, add cards
    const categories = await queryInterface.sequelize.query(
      `SELECT id, name, "urlKey" from categories;`
    );
    console.log(categories[0]);
    await queryInterface.bulkInsert('tldrs', categories[0].flatMap((category, i) => {
      return[
        {
          urlKey: `fun-${category.urlKey}`,
          categoryId: category.id,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          urlKey: `quitting-${category.urlKey}`,
          categoryId: category.id,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          urlKey: `learning-${category.urlKey}`,
          categoryId: category.id,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
    }));
    
    // ####
    // fetch cards, add versions
    const cards = await queryInterface.sequelize.query(
      `SELECT id, "categoryId" from tldrs;`
    );    
    await queryInterface.bulkInsert('tldr_versions', cards[0].map((card, i) => {
      return {
        content: JSON.stringify({
          steps: defaultSteps,
          title: titleCase(loremIpsum({count: 3, units: "words"})),
          blurb: loremIpsum({count: 1, units: "sentence", wordsPerSentence: { max: 16, min: 10}})
        }),
        tldrId: card.id,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));

    // ####
    // update tldrs with currentTldrVersionId
    // this is custom Postgres subqury magic
    return await queryInterface.sequelize.query(
      `UPDATE tldrs SET "currentTldrVersionId" = subquery.id, "draftContent" = subquery.content FROM (SELECT id, "tldrId" AS tldrid, content FROM tldr_versions) AS subquery WHERE tldrs.id = subquery.tldrId`
    );    

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
