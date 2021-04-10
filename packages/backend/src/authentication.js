const { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');

const makeRandomPassword = () => Math.random().toString(36).substr(10);



class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    return {
      anonymous: true
    }
  }
}

// GOOGLE STRATEGY
///https://docs.feathersjs.com/cookbook/authentication/google.html#using-the-data-returned-from-the-google-app-through-a-custom-oauth-strategy
class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {

    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);

    // this will grab the picture and email address of the Google profile
    const newData = {
      ...baseData,
      name: profile.name,
      email: profile.email,
      url: profile.picture,
      password: makeRandomPassword()
    };

    return newData;
  }
}


class AppleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    console.log('getEntityData 1');

    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);
    console.log('getEntityData 2');
    console.log(baseData);

    // this will grab the picture and email address of the Google profile
    const newData = {
      ...baseData,
      name: profile.firstName +" "+profile.lastName,
      email: profile.email,
      password: makeRandomPassword()
    };
    console.log('getEntityData 3');

    return newData;
  }
}

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('anonymous', new AnonymousStrategy());
  authentication.register('google', new GoogleStrategy());
  authentication.register('apple', new AppleStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
