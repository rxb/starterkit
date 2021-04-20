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
    find: [setRawFalse],
    get: [setRawFalse],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ log() ],
    find: [
      async (context) => {
        if(context.params.paginate !== false){
          context.result.items = context.result.data;
          //delete context.result.data;
        }
        return context;
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
