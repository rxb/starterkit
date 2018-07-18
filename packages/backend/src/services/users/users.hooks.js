const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const { queryWithCurrentUser } = require('feathers-authentication-hooks');

const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      // this is probably inefficient to always auth
      authenticate('jwt', {allowUnauthenticated: true}),
      (context) => {
        // this probably should fail in a redirect way
        // if you try to "self" a non-logged in request
        if (context.id == 'self' && context.params.user) {
          context.id = context.params.user.id;
        }
        return Promise.resolve(context)
      },
    ],
    create: [ hashPassword() ],
    update: [ hashPassword(), authenticate('jwt') ],
    patch: [ hashPassword(), authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
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
