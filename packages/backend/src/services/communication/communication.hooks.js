const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { allowAnonymous, getFullModel, protectUserFields } = require('../common_hooks.js');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      setField({
        from: 'params.user',
        as: 'data.user'
      })
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      protectUserFields("user.")
    ],
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
