const { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');

const makeRandomPassword = () => Math.random().toString(36).substr(10);

// sign in with apple
// https://medium.com/techulus/how-to-setup-sign-in-with-apple-9e142ce498d4
var jwt = require('jsonwebtoken');
const getAppleClientSecret = () => {
  // sign with RSA SHA256
  const privateKey = process.env.STARTERKIT_APPLE_PRIVATE_KEY;
  const headers = {
   kid: process.env.STARTERKIT_APPLE_KEY_ID,
   typ: undefined // is there another way to remove type?
  }
  const claims = {
   'iss': process.env.TEAM_ID,
   'aud': 'https://appleid.apple.com',
   'sub': process.env.STARTERKIT_APPLE_CLIENT_ID,
  }
 token = jwt.sign(claims, privateKey, {
   algorithm: 'ES256',
   header: headers,
   expiresIn: '24h'
  });
 return token
 }

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
  async authenticate(authentication, originalParams) {
    // generate the client_secret and insert it
    originalParams.secret = getAppleClientSecret();
    console.log(originalParams);
    const baseData = await super.authenticate(authentication, originalParams);
    return baseData;
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    console.log(baseData);
    return baseData;
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
