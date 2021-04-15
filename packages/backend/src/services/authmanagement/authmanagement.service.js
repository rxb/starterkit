// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');

module.exports = function (app) {
  app.configure(authManagement({ skipIsVerifiedCheck: true, ...notifier(app) }));
  const service = app.service('authManagement');
  service.hooks(hooks);
};