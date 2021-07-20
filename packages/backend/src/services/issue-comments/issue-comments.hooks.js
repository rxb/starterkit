const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const { setDefaultSort, getFullModel, protectUserFields } = require('../common_hooks.js');
const {buildHtmlEmail, renderButton} = require('../mailer/htmlEmail');


const includeAssociations = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  const { users } = sequelize.models;
  context.params.sequelize = {
    ...context.params.sequelize,
    include: ["author"]
  }
  return context;
}

const mustBeOwnerOrAdmin = (options) => {
  return iff(
    isProvider('external'),
    async (context) => {
      const issueComment = await context.service.get(context.id);
      const tldr = await context.service('tldrs').get(issueComment.tldrId);
      const issueCommentFields = Object.keys(context.service.Model.rawAttributes);
      if(context.params.user.id == issueComment.authorId){ // owner of issue
        // block all fields except status (others?)
        preventChanges(subtractFromArray(issueCommentFields, ["status"])); 
      }
      else if(context.params.user.id !== tldr.authorId){ // owner of tldr
        // block all fields except status (others?)
        preventChanges(subtractFromArray(issueCommentFields, ["status"])); 
      }
      else{
        throw new Forbidden('You are not allowed to access this');
      }
      return context;
    }
  );
}

// COMMENTS COUNT
const updateCommentsCount = async (context) => {
  const comments = await context.service.find({
    query: {
      issueId: context.data.issueId,
      $limit: 0 // count
    }
  });
  const issue = await context.app.service('issues').patch(context.data.issueId, {
    commentCount: comments.total
  });
  return context;
}

// SEND COMMENT NOTIFICATION
const sendIssueCommentEmail = async (context) => {

  // config
  const serverUrl = context.app.get('clientServer');
  const fromEmail = context.app.get('fromEmail');

  const issue = await context.app.service('issues').get(context.dispatch.issueId);
  const tldr = await context.app.service('tldrs').get(issue.tldrId);

  // get recipients to notify
  // maybe there's a feathers way to do this but for now
  // just custom query this stuff
  const sequelize = context.app.get('sequelizeClient');
  const [result, metadata] = await sequelize.query(`
    SELECT 
      DISTINCT users.email AS email
      FROM issue_comments
      INNER JOIN users ON issue_comments."authorId" = users.id 
      WHERE 
        issue_comments."issueId" = ${context.dispatch.issueId}
        AND users."notifyParticipatedIssues" = true
    UNION
    SELECT 
      DISTINCT users.email AS email
      FROM issues 
      INNER JOIN users ON issues."authorId" = users.id 
      WHERE 
        issues.id = ${context.dispatch.issueId}  
        AND users."notifyOwnedIssues" = true
  `);
  const bccEmails = result.map( r => r.email);

  // build email
  const linkBack = `${serverUrl}/tldr/issue?issueId=${context.dispatch.issueId}`;
  const truncate = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;
  const bodyContent = `
    <p><b>@${context.dispatch.author.urlKey}</b> posted:<br/> 
    ${truncate(context.dispatch.body, 140)}</p>
    ${renderButton('See the full issue', linkBack)}
  `.trim();
  const email = {
    from: `"@${context.dispatch.author.urlKey}" ${fromEmail}`,
    to: fromEmail,
    bcc: bccEmails,
    subject: `Re: [${tldr.urlKey}] ${issue.title}`,
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
      includeAssociations,
    ],
    get: [
      includeAssociations,
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
      protectUserFields('author.')
    ],
    get: [
      protectUserFields('author.')
    ],
    create: [
      updateCommentsCount,
      getFullModel(),
      sendIssueCommentEmail,
      protectUserFields('author.')
    ],
    update: [
      protectUserFields('author.')
    ],
    patch: [
      protectUserFields('author.')
    ],
    remove: [
      updateCommentsCount,
      protectUserFields('author.')
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
