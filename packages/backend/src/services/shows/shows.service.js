// Initializes the `user` service on path `/user`
const createService = require('feathers-sequelize');
const createModel = require('../../models/shows.model');
const hooks = require('./shows.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/shows', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('shows');

  service.hooks(hooks);
};
