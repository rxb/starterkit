const { authenticate } = require('@feathersjs/authentication').hooks;
const { associateCurrentUser } = require('feathers-authentication-hooks');

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
      },
      (context) => {
        console.log('sort sort sort sort sort');
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
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'id', as: 'authorId' })
    ],
    update: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'id', as: 'authorId' })
    ],
    patch: [],
    remove: []
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
