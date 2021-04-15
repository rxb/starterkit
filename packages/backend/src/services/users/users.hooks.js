const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider } = require('feathers-hooks-common');
const { queryWithCurrentUser } = require('feathers-authentication-hooks');
const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

const {
  allowAnonymous,
  saveAndGetNewImageReference
} = require('../common_hooks.js');

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const makeRandomPassword = () => Math.random().toString(36).substr(10);


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
      protect('password', 'verifyToken', 'verifyShortToken', 'verifyExpires', 'verifyChanges', 'resetToken', 'resetShortToken', 'resetExpires')
    ],
    find: [],
    get: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      checkForSelf(),
    ],
    create: [
      async (context) => {
        // for multistep registration
        // sometimes we need to temporarily fill fields we'll re-ask for later
        if(context.data.fillTempValues){
          const tempId = uid();
          const tempValues = [];
          // add temp name if no name
          if(!context.data.name){
            context.data.name =  `User ${tempId}`;
            tempValues.push("name");
          }
          // add temp urlkey if not urlkey
          if(!context.data.urlKey){
            context.data.urlKey =  `user-${tempId}`;
            tempValues.push("urlKey");
          }
          // add temp password if no password
          if(!context.data.password){
            context.data.password =  makeRandomPassword();
            // password doesn't need to be pushed to tempValues, that's a password reset
          }
          context.data.tempValues = tempValues;
        }
        return context
      },
      hashPassword('password'),
      saveAndGetNewImageReference()
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt'),
      checkForSelf(),
      saveAndGetNewImageReference(),
    ],
    patch: [
      iff(isProvider('external'), hashPassword('password')), // authManagement pre-hashes
      authenticate('jwt'),
      checkForSelf(),
      saveAndGetNewImageReference()
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
