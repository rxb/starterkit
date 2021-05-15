const { saveAndGetNewImageReference } = require('../common_hooks.js');
const { authenticate } = require('@feathersjs/authentication').hooks;

// TODO: shows never had an authorId, it's a logged-in free-for-all

// POPULATE ASSOCIATED THINGS
const populateShowAssociations = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  context.params.sequelize = {
    ...context.params.sequelize,
    include: ["tags"]
  }
  return context;
}

// ASSOCIATE TAGS (many-to-many)
const associateTags = async (context) => {
  const associations = context.data.tags.map(tag => ({ tagId: tag.id, showId: context.data.id }));
  // TODO: would be better if this were a transaction, but i'm not going to stress about it at the moment
  await context.app.service('shows-tags').remove(null, { query: { showId: context.data.id } });
  await context.app.service('shows-tags').create(associations);
  return context;
}


module.exports = {
  before: {
    all: [],
    find: [
      populateShowAssociations
    ],
    get: [
      populateShowAssociations
    ],
    create: [
      authenticate('jwt'),
      saveAndGetNewImageReference()
    ],
    update: [
      authenticate('jwt'),
      saveAndGetNewImageReference()
    ],
    patch: [
      authenticate('jwt'),
      saveAndGetNewImageReference(),
    ],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      associateTags
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
