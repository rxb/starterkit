const assert = require('assert');
const app = require('../../src/app');

describe('\'tldrs\' service', () => {
  it('registered the service', () => {
    const service = app.service('tldrs');

    assert.ok(service, 'Registered the service');
  });
});
