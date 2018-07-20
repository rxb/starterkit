

module.exports = {
  before: {
    all: [],
    find: [
      (context) => {
        const sequelize = context.app.get('sequelizeClient');
        const { ShowComments, users } = sequelize.models;
        context.params.sequelize = {
          raw: false, // don't know why, but it needs this to not flatten the children
          include: [ {
            model: ShowComments,
            include: [ users ]
          } ]
        }
        return context;
      }
    ],
    get: [
      (context) => {
        const sequelize = context.app.get('sequelizeClient');
        const { ShowComments, users } = sequelize.models;
        context.params.sequelize = {
          raw: false, // don't know why, but it needs this to not flatten the children
          include: [ {
            model: ShowComments,
            include: [ users ]
          } ]
        }
        return context;
      }
    ],
    create: [],
    update: [],
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
