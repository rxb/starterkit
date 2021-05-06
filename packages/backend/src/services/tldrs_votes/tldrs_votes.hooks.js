const { disallow } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'data.userId'
      }),
      // clear vote before doing another vote
      // other option would be diverting to patch/update
      async (context) => {
        await context.service.remove(null, context.params);
        return context
      }
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disallow('external')
    ],
    remove: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'data.userId'
      }) // this functions as security, must be owned by user, requires 'multi' in service
    ]
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
