const { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios').default;

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
  async getProfile (data, _params) {
    const response = await axios.get('https://appleid.apple.com/auth/keys');
    const keys = response.data.keys;
    for( let i=0; i<keys.length; i++ ){
      try{
        const pem = jwkToPem(keys[i]);
        const tokenData = jwt.verify(data.id_token, pem);
        const user = data.user || {}
        return {
          ...tokenData,
          user
        };
      }
      catch(error){
        // nothing needed
      }
    }
    return false;    
  }

  async getEntityData(profile) {

    const baseData = await super.getEntityData(profile);
    const name = profile.user.name ? (profile.user.name.firstName+" "+profile.user.name.lastName) : false
    const newData = {
      ...baseData,
      name,
      password: makeRandomPassword()
    };

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
