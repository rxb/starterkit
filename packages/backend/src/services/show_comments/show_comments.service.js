// Initializes the `ShowComments` service on path `/show-comments`
const createService = require('feathers-sequelize');
const createModel = require('../../models/show_comments.model');
const hooks = require('./show_comments.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/show_comments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('show_comments');

  service.hooks(hooks);
};
