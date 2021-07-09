const assert = require('assert');
const app = require('../../src/app');

describe('\'communication\' service', () => {
  it('registered the service', () => {
    const service = app.service('communication');

    assert.ok(service, 'Registered the service');
  });
});
