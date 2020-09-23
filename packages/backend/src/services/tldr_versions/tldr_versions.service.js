// Initializes the `tldr_versions` service on path `/tldr-versions`
const { TldrVersions } = require('./tldr_versions.class');
const createModel = require('../../models/tldr_versions.model');
const hooks = require('./tldr_versions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tldr-versions', new TldrVersions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tldr-versions');

  service.hooks(hooks);
};
