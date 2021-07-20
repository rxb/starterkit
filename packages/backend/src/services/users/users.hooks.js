const { Forbidden } = require('@feathersjs/errors');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { allowAnonymous, saveAndGetNewImageReference, protectUserFields, checkForSelfId, convertFalsyToNull } = require('../common_hooks.js');
const acceptLanguageParser = require('accept-language-parser');

const makeUid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const makeRandomPassword = () => Math.random().toString(36).substr(10);

// todo: add admin access
const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'),
    async (context) => {
      if (context.params.user.id !== context.id) {
        throw new Forbidden('You are not allowed to access this');
      }
      return context;
    }
  );
}

const preventChangesToAuthFields = (options) => {
  return iff(
    isProvider('external'),
    preventChanges(
      false,
      'isVerified',
      'verifyToken',
      'verifyShortToken',
      'verifyExpires',
      'verifyChanges',
      'resetToken',
      'resetShortToken',
      'resetExpires',
      'facebookId',
      'googleId',
      'redditId',
      'appleId'
    ));
}

// for multistep registration
// sometimes we need to temporarily fill fields we'll re-ask for later
const fillTempValues = (options) => {
  return async (context) => {
    if (context.data.fillTempValues) {
      const tempId = makeUid();
      const tempValues = [];
      // add temp name if no name
      if (!context.data.name) {
        context.data.name = `User ${tempId}`;
        tempValues.push("name");
      }
      // add temp urlkey if not urlkey
      if (!context.data.urlKey) {
        context.data.urlKey = `user-${tempId}`;
        tempValues.push("urlKey");
      }
      // add temp password if no password
      if (!context.data.password) {
        context.data.password = makeRandomPassword();
        // password doesn't need to be pushed to tempValues, that's a password reset
      }
      // attempt to add country if no country
      if (!context.data.country) {
        const languages = acceptLanguageParser.parse(context.params.headers["accept-language"]);
        context.data.country = (languages && languages.length > 0) ? languages[0].region : '';
        // not going to push this this as tempValue though. they can see it and change it
      }
      context.data.tempValues = tempValues;
    }
    return context
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      allowAnonymous(),
      authenticate('jwt', 'anonymous'),
      checkForSelfId({ key: 'id' }),
    ],
    create: [
      // create user is the only create that doesn't need to be authed already
      fillTempValues(),
      hashPassword('password'),
      saveAndGetNewImageReference(),
      convertFalsyToNull({fields: ["link"]})
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt'),
      checkForSelfId({ key: 'id' }),
      mustBeOwnerOrAdmin(),
      preventChangesToAuthFields(),
      saveAndGetNewImageReference(),
      convertFalsyToNull({fields: ["link"]})
    ],
    patch: [
      // authManagement pre-hashes password when setting it from the reset method
      iff(isProvider('external'), hashPassword('password')),
      authenticate('jwt'),
      checkForSelfId({ key: 'id' }),
      mustBeOwnerOrAdmin(),
      preventChangesToAuthFields(),
      saveAndGetNewImageReference(),
      convertFalsyToNull({fields: ["link"]})
    ],
    remove: [
      authenticate('jwt'),
      checkForSelfId({ key: 'id' }),
      mustBeOwnerOrAdmin()
    ]
  },

  after: {
    all: [],
    find: [
      protectUserFields()
    ],
    get: [
      protectUserFields("", ['email', 'notifyOwnedIssues', 'notifyParticipatedIssues'])
    ],
    create: [
      protectUserFields()
    ],
    update: [
      protectUserFields()
    ],
    patch: [
      protectUserFields()
    ],
    remove: [
      protectUserFields()
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
