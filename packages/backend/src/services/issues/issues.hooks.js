const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { setDefaultSort, getFullModel, protectUserFields } = require('../common_hooks.js');
const buildHtmlEmail = require('../mailer/buildHtmlEmail');

const includeAssociations = (associations) => {
  return async (context) => {
    const sequelize = context.app.get('sequelizeClient');
    context.params.sequelize = {
      ...context.params.sequelize,
      include: associations
    }
    return context;
  }
}
const subtractFromArray = (originalArray, subtractArray) => (
  originalArray.filter(value => !subtractArray.includes(value))
);

const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'),
    async (context) => {
      const issue = await context.service.get(context.id);
      const issueFields = Object.keys(context.service.Model.rawAttributes);
      if(context.params.user.id == issue.authorId){ // owner of issue
        // block all fields except status (others?)
        preventChanges(subtractFromArray(issueFields, ["status"])); 
      }
      else if(context.params.user.id !== issue.tldr.authorId){ // owner of tldr
        // block all fields except status (others?)
        preventChanges(subtractFromArray(issueFields, ["status"])); 
      }
      else{
        throw new Forbidden('You are not allowed to access this');
      }
      return context;
    }
  );
}

// ISSUES COUNT
// should this be total issues or open issues?
const updateIssuesCount = async (context) => {
  const issues = await context.service.find({
    query: {
      //status: 1, // open issues
      tldrId: context.data.tldrId,
      $limit: 0 // count
    }
  });
  const tldr = await context.app.service('tldrs').patch(context.data.tldrId, {
    issueCount: issues.total
  });
  return context;
}

const sendIssueCreateEmail = async (context) => {

  // config
  const serverUrl = context.app.get('clientServer');
  const fromEmail = context.app.get('fromEmail');
  const tldr = await context.app.service('tldrs').get(context.dispatch.tldrId);

  // don't send if notifications are turned off
  if(!tldr.author.notifyOwnedIssues){
    return context;
  }

  // build email
  const linkBack = `${serverUrl}/tldr/issue?issueId=${context.dispatch.id}`;
  const bodyContent = `
    <h1>New issue: ${context.dispatch.title}</h1>
    <p><b>@${context.dispatch.author.urlKey}</b> opened a new issue about your card <b>${tldr.urlKey}</b>.</p>
    <p>${context.dispatch.body}</p>
    <p>See the full issue here: <a href="${linkBack}">${linkBack}</a></p>
  `.trim();
  const email = {
    from: fromEmail,
    to: tldr.author.email,
    subject: `New Issue: ${context.dispatch.title}`,
    html: buildHtmlEmail({}, bodyContent)
  };

  // send
  context.app.service('mailer').create(email).then(function (result) {
    console.log('Sent email', result)
  }).catch(err => {
    console.log('Error sending email', err)
  });
  return context;
}

module.exports = {
  before: {
    all: [],
    find: [
      setDefaultSort({ field: 'createdAt', order: 1 }),
      includeAssociations(["author"]),
    ],
    get: [
      includeAssociations(["author"]),
    ],
    create: [
      authenticate('jwt'),
      setField({
        from: 'params.user.id',
        as: 'data.authorId'
      })
    ],
    update: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
    ],
    patch: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
    ],
    remove: [
      authenticate('jwt'),
      mustBeOwnerOrAdmin()
    ]
  },

  after: {
    all: [],
    find: [
      protectUserFields('users.')
    ],
    get: [
      protectUserFields('users.')
    ],
    create: [
      updateIssuesCount,
      getFullModel(),
      sendIssueCreateEmail,
      protectUserFields('users.')
    ],
    update: [
      protectUserFields('users.')
    ],
    patch: [
      protectUserFields('users.')
    ],
    remove: [
      updateIssuesCount,
      protectUserFields('users.')
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
