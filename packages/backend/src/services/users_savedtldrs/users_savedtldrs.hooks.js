const { disallow } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider } = require('feathers-hooks-common');

// todo: add admin access
const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'), 
    async(context) => {
      const item = await context.service.get(context.id);
      if(context.params.user.id !== item.userId){
        throw new Forbidden('You are not allowed to access this');
      }
      return context;
    }
  );
} 


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
      })
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disallow('external')
    ],
    remove: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
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
