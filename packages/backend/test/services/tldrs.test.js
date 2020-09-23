const assert = require('assert');
const app = require('../../src/app');

describe('\'tldrs\' service', () => {
  it('registered the service', () => {
    const service = app.service('t');

    assert.ok(service, 'Registered the service');
  });
});
