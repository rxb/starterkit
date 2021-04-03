const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const { queryWithCurrentUser } = require('feathers-authentication-hooks');
const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

const {
  allowAnonymous,
  saveAndGetNewImageReference
} = require('../common_hooks.js');

module.exports = {
  before: {
    all: [
      protect('password')
    ],
    find: [],
    get: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      async (context) => {
        if (context.id == "self") {
          if(context.params.user){
            context.id = context.params.user.id;
          }
          else{
            throw new Error("Need to log in to get your user info");
          }
        }
        return context;
      }

    ],
    create: [
      hashPassword('password'),
      saveAndGetNewImageReference(),
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt'),
      saveAndGetNewImageReference(),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      saveAndGetNewImageReference(),
    ],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
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
