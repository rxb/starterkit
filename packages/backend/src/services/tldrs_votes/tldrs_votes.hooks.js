const { disallow } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider } = require('feathers-hooks-common');

const updateVoteTally = async(context) => {
  const upvotes = await context.service.find({query: {
    vote: 1,
    tldrId: context.params.query.tldrId,
    $limit: 0 // count
  }});
  const downvotes = await context.service.find({query: {
    vote: -1,
    tldrId: context.params.query.tldrId,
    $limit: 0 // count
  }});
  const voteQuantity = upvotes.total + downvotes.total;
  const voteResult = upvotes.total - downvotes.total;
  const votePositivity = (voteQuantity > 0) ? Math.round((upvotes.total / voteQuantity)*100) : 0;
  const tldr = await context.app.service('tldrs').patch(context.params.query.tldrId, {
    voteQuantity,
    voteResult,
    votePositivity  
  });
  return context;
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
      }),
      // so that vote tally after hook can get data from query in both create + remove hooks
      setField({
        from: 'data.tldrId',
        as: 'params.query.tldrId'
      }),
      // clear vote before doing another vote
      // other option would be diverting to patch/update
      async (context) => {
        await context.service.remove(null, {query: {userId: context.params.user.id, tldrId: context.data.tldrId}});
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
        as: 'params.query.userId'
      }) // this functions as security, must be owned by user, requires 'multi' in service
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      updateVoteTally
    ],
    update: [],
    patch: [],
    remove: [
      updateVoteTally
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
