const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const hydrate = require('feathers-sequelize/hooks/hydrate');


module.exports = {
  before: {
    all: [
      (context) => {
        const sequelize = context.app.get('sequelizeClient');
        const { users } = sequelize.models;
        context.params.sequelize = {
          raw: false,
          include: [ users ]
        }
        return context;
      }
    ],
    find: [
      // this is only find-relevant
      // if you put it in other hooks, they get weird
      (context) => {
        const { query = {} } = context.params;
        if(!query.$sort) {
          query.$sort = {
            'createdAt': 1
          }
        }
        context.params.query = query;
        return context;
      }
    ],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'id', as: 'authorId' }),
    ],
    update: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'id', ownerField: 'authorId' })
    ],
    patch: [],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'id', ownerField: 'authorId' })
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
