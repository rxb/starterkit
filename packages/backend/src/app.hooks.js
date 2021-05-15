const { iff, isProvider } = require('feathers-hooks-common');

// Application hooks that run for every service
const log = require('./hooks/log');

// raw:true is the default
// but it does weird stuff, especially to nested models
// but there are performance concerns so
// let's see how it goes
const setRawFalse = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  context.params.sequelize = {
    raw: false
  }
  return context;
}

module.exports = {
  before: {
    all: [],
    find: [iff(isProvider('external'), setRawFalse)],
    get: [iff(isProvider('external'), setRawFalse)],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [log()],
    find: [
      iff(isProvider('external'),
        async (context) => {
          // rename data -> items to avoid data.data weirdness (but only for external api)
          if (context.params.paginate !== false) {
            context.result.items = context.result.data;
            delete context.result.data;
          }
          return context;
        }
      )
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
