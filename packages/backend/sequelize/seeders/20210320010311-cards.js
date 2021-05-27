'use strict';

const loremIpsum = require("lorem-ipsum").loremIpsum;
const getRandoSentence = (min, max) => {
  return loremIpsum({sentenceLowerBound: min, sentenceUpperBound: max});
}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

const defaultSteps = [{ "body": "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "head": "Excepteur sint occaecat cupidatat", "note": "Well here we are with a note" }, { "body": "sed do eiusmod tempor incididunt ut labore Okay lets go", "head": "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "note": "Well here we are with a note" }, { "body": "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. sed do eiusmod tempor incididunt ut labore Okay lets go", "head": "Excepteur sint occaecat cupidatat", "note": "Well here we are with a note" }, { "body": "sed do eiusmod tempor incididunt ut labore Okay lets go", "head": "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "note": "Well here we are with a note" }, { "body": "Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "head": "Excepteur sint occaecat cupidatat", "note": "Well here we are with a note" }];

const buildSteps =  () => {
  const steps = [];
  for(let i=0; i<5; i++){
    const headText = getRandoSentence(5, 8);
    const bodyText = getRandoSentence(10, 15);
    steps.push({
      head: headText,
      body: bodyText,
      note: "Well here we are with a note"
    });
  }
  return steps;
}

const buildTitle = () => {
  const text = getRandoSentence(2, 4);
  return titleCase(text);
}

const buildBlurb = () => {
  const text = getRandoSentence(10, 16);
  return text;
}

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
      return [
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
        {
          urlKey: `awesome-${category.urlKey}`,
          categoryId: category.id,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date()
        },  
        {
          urlKey: `special-${category.urlKey}`,
          categoryId: category.id,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date()
        }               
      ];
    }));
    console.log('insert cards');

    // ####
    // fetch cards, add versions
    const cards = await queryInterface.sequelize.query(
      `SELECT id, "categoryId" from tldrs;`
    );
    console.log('fetch cards');

    await queryInterface.bulkInsert('tldr_versions', cards[0].map((card, i) => {
      const steps =  buildSteps();
      const title =  buildTitle();
      const blurb =  buildBlurb();
      const cardVersion = {
        content: JSON.stringify({
          steps: steps,
          title: title,
          blurb: blurb
        }),
        tldrId: card.id,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      console.log(cardVersion);  
      return cardVersion;
    }));
    console.log('insert versions');


    // ####
    // update tldrs with currentTldrVersionId
    // this is custom Postgres subqury magic
    return await queryInterface.sequelize.query(
      `UPDATE tldrs SET "currentTldrVersionId" = subquery.id, "draftContent" = subquery.content, "currentTldrVersionContent" = subquery.content FROM (SELECT id, "tldrId" AS tldrid, content FROM tldr_versions) AS subquery WHERE tldrs.id = subquery.tldrId`
    );

    console.log('reference versions');

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     queryInterface.bulkDelete('tldrs', null, {});
     queryInterface.bulkDelete('tldr_versions', null, {});
  }
};
