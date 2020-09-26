

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
    patch: [
      // special handling if this is a publish
      async (context) => {
        if(context.data[publish]){
          const data = {};
          const tldr_version = await context.app.service('tldr_versions').create(data);
          context.data[opts.currentTldrVersionId] = tldr_version.id;
        }
        return context;
      }
    ],
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
