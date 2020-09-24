

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      (context) => {
        context.params.sequelize = {
          ...context.params.sequelize,
          include: [
            "author",
            "currentTldrVersion"
          ]
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
