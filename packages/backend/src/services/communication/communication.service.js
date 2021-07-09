// Initializes the `communication` service on path `/communication`
const { Communication } = require('./communication.class');
const hooks = require('./communication.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/communication', new Communication(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('communication');

  service.hooks(hooks);
};
