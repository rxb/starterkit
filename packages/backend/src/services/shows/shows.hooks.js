const {
  populatePhotoUrl,
  saveAndGetNewImageReference
} = require('../common_hooks.js');

// POPULATE ASSOCIATED THINGS
// (and users/authors)
const populateShowAssociations = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  const { ShowComments, users, tags } = sequelize.models;
  context.params.sequelize = {
    raw: false, // don't know why, but it needs this to not flatten the children
    include: [
      {
        model: ShowComments,
        include: [ users ]
      },
      {
        model: tags,
        as: 'tags'
      }
    ]
  }
  return context;
}


// ASSOCIATE TAGS (many-to-many)
const associateTags = async (context) => {
  const associations = context.data.tags.map( tag => ({tagId: tag.id, showId: context.data.id}) );
  // TODO: would be better if this were a transaction, but i'm not going to stress about it at the moment
  await context.app.service('shows-tags').remove(null, {query: {showId: context.data.id}});
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
      saveAndGetNewImageReference
    ],
    update: [
      saveAndGetNewImageReference
    ],
    patch: [
      saveAndGetNewImageReference,
    ],
    remove: []
  },

  after: {
    all: [
      populatePhotoUrl
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
    all: [ ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
