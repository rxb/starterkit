// const authManagement = require('feathers-authentication-management');
const { AuthenticationManagementService } = require("feathers-authentication-management");
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');


module.exports = function (app) {
  // app.configure(authManagement({ skipIsVerifiedCheck: true, ...notifier(app) }));
  app.use("/auth-management", new AuthenticationManagementService(app, {
    skipIsVerifiedCheck: true, 
    ...notifier(app)
  }));
  const service = app.service('auth-management');
  service.hooks(hooks);
};