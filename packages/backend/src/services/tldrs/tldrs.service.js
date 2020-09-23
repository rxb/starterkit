// Initializes the `tldrs` service on path `/tldrs`
const { Tldrs } = require('./tldrs.class');
const createModel = require('../../models/tldrs.model');
const hooks = require('./tldrs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tldrs', new Tldrs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tldrs');

  service.hooks(hooks);
};
