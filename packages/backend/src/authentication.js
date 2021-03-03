const { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    return {
      anonymous: true
    }
  }
}

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('anonymous', new AnonymousStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
