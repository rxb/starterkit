

module.exports = {
  before: {
    all: [],
    find: [
      // get "top tldr"
      // TODO: make it actually "top" or featured in some way, maybe selected
      // TODO: I feel like there's a better way to do this
      (context) => {
        const sequelize = context.app.get('sequelizeClient');
        const { tldrs } = sequelize.models;
        context.params.sequelize = {
          ...context.params.sequelize,
          include: [{
            model: tldrs,
            limit: 1,
            include: ["currentTldrVersion", "author"]
          }]
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
