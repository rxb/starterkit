// Initializes the `tldrs_votes` service on path `/tldrs-votes`
const { TldrsVotes } = require('./tldrs_votes.class');
const createModel = require('../../models/tldrs_votes.model');
const hooks = require('./tldrs_votes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/tldrs-votes', new TldrsVotes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tldrs-votes');

  service.hooks(hooks);
};
