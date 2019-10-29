const assert = require('assert');
const app = require('../../src/app');

describe('\'shows_tags\' service', () => {
  it('registered the service', () => {
    const service = app.service('shows-tags');

    assert.ok(service, 'Registered the service');
  });
});
