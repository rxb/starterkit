const assert = require('assert');
const app = require('../../src/app');

describe('\'tldr_versions\' service', () => {
  it('registered the service', () => {
    const service = app.service('tldr-versions');

    assert.ok(service, 'Registered the service');
  });
});
