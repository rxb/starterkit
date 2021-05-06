const { disallow } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider } = require('feathers-hooks-common');

const updateVoteTally = async(context) => {
  console.log(context.data);
  const upvotes = await context.service.find({query: {
    vote: 1,
    tldrId: context.result.tldrId,
    $limit: 0 // count
  }});
  const downvotes = await context.service.find({query: {
    vote: -1,
    tldrId: context.data.tldrId,
    $limit: 0 // count
  }});
  //console.log(upvotes);
  //console.log(downvotes);
  const voteQuantity = upvotes.total + downvotes.total;
  const voteResult = upvotes.total - downvotes.total;
  const votePositivity = (voteQuantity > 0) ? voteResult / voteQuantity : 0;
  //console.log(`quantity: ${voteQuantity} result: ${voteResult} positivity: ${votePositivity} `)
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
      (context) => {
        console.log(context.data);
        return context;
      },
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
      }), // this functions as security, must be owned by user, requires 'multi' in service
      (context) => {
        console.log(context.data);
        return context;
      }
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
