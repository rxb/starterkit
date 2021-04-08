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

const uid = function(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const checkForSelf = (options) => {
  return async(context) => {
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
}

const getFullModel = (options) => {
  return async(context) => {
    // .dispatch is the optional return without protected fields, like password
    context.dispatch = await context.service.get(context.result.id, context.params);
    return context;
  }
}

module.exports = {
  before: {
    all: [
      protect('password')
    ],
    find: [],
    get: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      checkForSelf(),
    ],
    create: [
      hashPassword('password'),
      saveAndGetNewImageReference(),
      async (context) => {
        const tempId = uid();

        // add temp name if no name
        if(!context.data.name){
          context.data.name =  `User ${tempId}`;
        }
        // add temp urlkey if not urlkey
        if(!context.data.urlKey){
          context.data.urlKey =  `user-${tempId}`;
        }
        return context
      },
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt'),
      checkForSelf(),
      saveAndGetNewImageReference(),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      checkForSelf(),
      saveAndGetNewImageReference(),
    ],
    remove: [
      authenticate('jwt'),
      checkForSelf(),
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
