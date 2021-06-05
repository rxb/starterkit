// Initializes the `Issues` service on path `/issues`
const { Issues } = require('./issues.class');
const createModel = require('../../models/issues.model');
const hooks = require('./issues.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issues', new Issues(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issues');

  service.hooks(hooks);
};
