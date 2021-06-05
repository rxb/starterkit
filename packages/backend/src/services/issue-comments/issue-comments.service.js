// Initializes the `IssueComments` service on path `/issue-comments`
const { IssueComments } = require('./issue-comments.class');
const createModel = require('../../models/issue-comments.model');
const hooks = require('./issue-comments.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issue-comments', new IssueComments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issue-comments');

  service.hooks(hooks);
};
