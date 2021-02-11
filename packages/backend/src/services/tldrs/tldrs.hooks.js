const populateTldrAssociations = (context) => {
  context.params.sequelize = {
    ...context.params.sequelize,
    include: [
      "author",
      "currentTldrVersion"
    ]
  }
  return context;
}

module.exports = {
  before: {
    all: [],
    find: [
      populateTldrAssociations
    ],
    get: [
      populateTldrAssociations
    ],
    create: [],
    update: [],
    patch: [
      async (context) => {
          
        // special handling if this is a publish
        if(context.data.publish){
          
          // get tldr from source, increment version number
          const tldr = await context.app.service('tldrs').get(context.data.id);
          const newVersion = tldr.versionsUsedCount + 1;
          
          // publish new tldr_version
          const data = {
            content: context.data.draftContent,
            tldrId: context.data.id,
            version: newVersion
          };
          const tldr_version = await context.app.service('tldr-versions').create(data);

          // update references in the tldr
          context.data.currentTldrVersionId = tldr_version.id;
          context.data.versionsUsedCount = newVersion;
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
