const assert = require('assert');
const app = require('../../src/app');

describe('\'ShowComments\' service', () => {
  it('registered the service', () => {
    const service = app.service('show-comments');

    assert.ok(service, 'Registered the service');
  });
});
