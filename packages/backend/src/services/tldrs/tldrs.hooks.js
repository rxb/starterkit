const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { allowAnonymous, protectUserFields } = require('../common_hooks.js');
const _ = require('lodash');

// _.merge customizer to concat arrays, not replace slots
const appendArrayMerge = (objValue, srcValue) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const populateTldrAssociations = async (context) => {
  _.mergeWith(context.params.sequelize, {
    include: [
      "author",
      "currentTldrVersion",
      "category"
    ]
  }, appendArrayMerge);
  return context;
}

const populateCurrentUserAssociations = async (context) => {
  if (context.params.user) {
    _.mergeWith(context.params.sequelize, {
      include: [
        {
          model: context.app.services["users-savedtldrs"].Model,
          as: "save",
          where: { userId: context.params.user.id },
          required: false
        },
        {
          model: context.app.services["tldrs-votes"].Model,
          as: "vote",
          where: { userId: context.params.user.id },
          required: false
        }
      ]
    }, appendArrayMerge);
  }
  return context;
}

// todo: add admin access
const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'),
    async (context) => {
      const item = await context.service.get(context.id);
      if (context.params.user.id !== item.authorId) {
        throw new Forbidden('You are not allowed to access this');
      }
      return context;
    }
  );
}

const publishToVersion = (options) => {
  return async (context) => {
    // special handling if this is a publish
    if (context.data.publish) {

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
      context.data.currentTldrVersionContent = context.data.draftContent;
    }
    return context;
  }
}

const updateCategoryCount = (options) => {
  return async (context) => {
    // get the category of this card
    let categoryId;
    if(context.dispatch.categoryId){
      categoryId = context.dispatch.categoryId
    }
    else{
      // for patch actions... category isn't available in context.data
      const tldr = await context.app.service('tldrs').get(context.dispatch.id);
      categoryId = tldr.categoryId;
    }

    // query the number of tldrs in category
    const categoryTldrs = await context.service.find({
      query: {
        categoryId: categoryId,
        currentTldrVersionId: {$ne: null},
        $limit: 0 // count
      }
    });

    // update the count in the category
    const category = await context.app.service('categories').patch(categoryId, {
      tldrCount: categoryTldrs.total
    });
    return context;
  }
}

const noDraftsExceptForSelf = (options) => {
  return async (context) => {
    // if asking for a users authorId tldrs
    // and logged-in user IS that user
    if (context.params.query.authorId && context.params.user && context.params.query.authorId == context.params.user.id) {
      // no need to filter drafts
    }
    else {
      // otherwise filter out drafts
      context.params.query.currentTldrVersionId = { '$ne': null };
    }
    return context;
  }
}

// if selfSaved == true, get a logged-in user's list of saved cards
const querySelfSaved = () => {
  return async (context) => {
    if (context.params.query.selfSaved) {
      delete context.params.query.selfSaved;
      if (context.params.user) {
        _.mergeWith(context.params.sequelize, {
          include: [{
            model: context.app.services["users-savedtldrs"].Model,
            as: "save",
            where: { userId: context.params.user.id }
          }]
        });
      }
      else {
        throw new Forbidden('You are not allowed to access this');
      }
    }
    return context;
  }
}

const querySearch = () => {
  return async (context) => {
    if (context.params.query._search) {
      const sequelize = context.app.get('sequelizeClient');

      // create tsquery
      const tsquery = sequelize.fn('plainto_tsquery', context.params.query._search)

      // change plain text from REST into a tsquery match
      context.params.query._search = {'$match': tsquery}

      // add rank to attributes, order by rank
      // have to drop into seqeulize config for this kind of stuff
      _.mergeWith(context.params.sequelize, {
        attributes: {
          // include because it's additional not an explicit whitelist
          include: [
            [sequelize.fn('ts_rank', sequelize.literal('"_search"'), tsquery), 'tsrank']
          ]
        },
        order: [
          [sequelize.literal('tsrank'), 'DESC']
        ]
      });
    }
    return context;
  }
}


module.exports = {
  before: {
    all: [],
    find: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      populateTldrAssociations,
      noDraftsExceptForSelf(),
      querySelfSaved(),
      querySearch()
    ],
    get: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      populateTldrAssociations,
      populateCurrentUserAssociations,
    ],
    create: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'data.authorId'
      }),
      
    ],
    update: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin(),
      publishToVersion()
    ],
    patch: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin(),
      publishToVersion(),
    ],
    remove: [
      // TODO: should you really be able to completely delete a card?
      // TODO: what are all the other effects of deleting a card?
      authenticate('jwt'),
      mustBeOwnerOrAdmin(),
    ]
  },

  after: {
    all: [
      protectUserFields("author.")
    ],
    find: [],
    get: [],
    create: [
      updateCategoryCount()
    ],
    update: [],
    patch: [
      updateCategoryCount()
    ],
    remove: [
      updateCategoryCount()
    ]
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
