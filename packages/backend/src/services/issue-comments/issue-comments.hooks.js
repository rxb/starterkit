const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { setDefaultSort, getFullModel } = require('../common_hooks.js');

const includeAssociations = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  const { users } = sequelize.models;
  context.params.sequelize = {
    ...context.params.sequelize,
    include: [users]
  }
  return context;
}

const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'),
    async (context) => {
      const issueComment = await context.service.get(context.id);
      const tldr = await context.service('tldrs').get(issueComment.tldrId);
      const issueCommentFields = Object.keys(context.service.Model.rawAttributes);
      if(context.params.user.id == issueComment.authorId){ // owner of issue
        // block all fields except status (others?)
        preventChanges(subtractFromArray(issueCommentFields, ["status"])); 
      }
      else if(context.params.user.id !== tldr.authorId){ // owner of tldr
        // block all fields except status (others?)
        preventChanges(subtractFromArray(issueCommentFields, ["status"])); 
      }
      else{
        throw new Forbidden('You are not allowed to access this');
      }
      return context;
    }
  );
}

module.exports = {
  before: {
    all: [],
    find: [
      setDefaultSort({ field: 'createdAt', order: 1 }),
      includeAssociations,
    ],
    get: [
      includeAssociations,
    ],
    create: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'data.authorId'
      })
    ],
    update: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
    ],
    patch: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
    ],
    remove: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
    ]
  },

  after: {
    all: [
      protectUserFields('users.')
    ],
    find: [],
    get: [],
    create: [
      getFullModel()
    ],
    update: [],
    patch: [],
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
