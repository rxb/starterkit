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
