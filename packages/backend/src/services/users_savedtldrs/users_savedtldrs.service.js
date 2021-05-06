// Initializes the `users_savedtldrs` service on path `/users-savedtldrs`
const { UsersSavedtldrs } = require('./users_savedtldrs.class');
const createModel = require('../../models/users_savedtldrs.model');
const hooks = require('./users_savedtldrs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/users-savedtldrs', new UsersSavedtldrs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users-savedtldrs');

  service.hooks(hooks);
};
