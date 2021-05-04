const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { protectUserFields, setDefaultSort, getFullModel } = require('../common_hooks.js');

const includeAssociations = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  const { users } = sequelize.models;
  context.params.sequelize = {
    ...context.params.sequelize,
    include: [ users ]
  }
  return context;
}

// todo: add admin access
const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'),
    async(context) => {
      const item = await context.service.get(context.id);
      if(context.params.user.id !== item.authorId){
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
      setDefaultSort({field: 'createdAt', order: 1}),
      includeAssociations,
    ],
    get: [
      includeAssociations
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
