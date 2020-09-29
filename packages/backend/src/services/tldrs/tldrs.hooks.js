

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
        if(context.data.publish){
            const data = {
            content: context.data.draftContent,
            tldrId: context.data.id
          };
          const tldr_version = await context.app.service('tldr-versions').create(data);
          context.data.currentTldrVersionId = tldr_version.id;
        }
        else{
          console.log('no publish')
          console.log(context.data)
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
