const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
//const hydrate = require('feathers-sequelize/hooks/hydrate');
//const dehydrate = require('feathers-sequelize/hooks/dehydrate');

const includeAssociations = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  const { users } = sequelize.models;
  context.params.sequelize = {
    raw: false,
    include: [ users ]
  }
  return context;
}


module.exports = {
  before: {
    all: [
      // doesn't seem like sequlize likes to mess with associations
      // for create/update/patch/remove methods
      // seems like you need .reload() on the model
      // not sure how to do that in feathers-sequelize
    ],
    find: [
      (context) => {
        // sorting is only find-relevant
        // if you put it in other hooks, they get weird
        const { query = {} } = context.params;
        if(!query.$sort) {
          query.$sort = {
            'createdAt': 1
          }
        }
        context.params.query = query;
        return context;
      },
      includeAssociations,
    ],
    get: [
      includeAssociations
    ],
    create: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'data.authorId'
      })
      /*
      // see https://www.npmjs.com/package/feathers-authentication-hooks for migration
      associateCurrentUser({ idField: 'id', as: 'authorId' }),
      */
    ],
    update: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'params.query.authorId'
      })
      /*
      restrictToOwner({ idField: 'id', ownerField: 'authorId' })
      */
    ],
    patch: [],
    remove: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'params.query.authorId'
      })
      /*
      restrictToOwner({ idField: 'id', ownerField: 'authorId' })
      */
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      async (context) => {
        context.result = await context.service.get(context.result.id, context.params);
        return context
      },
    ],
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
