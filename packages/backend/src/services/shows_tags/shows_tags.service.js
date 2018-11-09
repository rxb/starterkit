// Initializes the `shows_tags` service on path `/shows-tags`
const createService = require('feathers-sequelize');
const createModel = require('../../models/shows_tags.model');
const hooks = require('./shows_tags.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/shows-tags', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('shows-tags');

  service.hooks(hooks);
};
