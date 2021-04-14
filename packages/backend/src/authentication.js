const { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');

/*
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios').default;
*/

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    return {
      anonymous: true
    }
  }
}

async function authenticateCustom (authentication, originalParams) {
  const entity = this.configuration.entity;
  const { provider, ...params } = originalParams;
  const profile = await this.getProfile(authentication, params);
  const existingEntity = await this.findEntity(profile, params)
    || await this.getCurrentEntity(params);

  // instead of update, just get
  const authEntity = !existingEntity ? await this.createEntity(profile, params)
    : await this.updateEntity(existingEntity, profile, params);

  return {
    authentication: { strategy: this.name },
    [entity]: await this.getEntity(authEntity, originalParams)
  };
}


// GOOGLE STRATEGY
///https://docs.feathersjs.com/cookbook/authentication/google.html#using-the-data-returned-from-the-google-app-through-a-custom-oauth-strategy
class GoogleStrategy extends OAuthStrategy {
  async getProfile (data, _params) {
    return data.profile;
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    const newData = {
      ...baseData,
      name: profile.name,
      email: profile.email,
      url: profile.picture,
      fillTempValues: true,   // fill semi-required things that are missing
      profileComplete: false  // have the user review it
    };
    return newData;
  }

  async authenticate(authentication, originalParams){
    return await authenticateCustom(authentication, originalParams);
  }
}

class AppleStrategy extends OAuthStrategy {
  /*
  async getProfile (data, _params) {
    const response = await axios.get('https://appleid.apple.com/auth/keys');
    const keys = response.data.keys;
    for( let i=0; i<keys.length; i++ ){
      try{
        const pem = jwkToPem(keys[i]);
        const tokenData = jwt.verify(data.id_token, pem);
        return tokenData;
      }
      catch(error){
        // nothing needed
      }
    }
    return false;    
  }
  */

  async getProfile (data, _params) {
    return data.jwt.id_token.payload;
  }

  async getEntityData(profile) {
    // this seems to update local info even if it already exists
    // that's not great
  
    const baseData = await super.getEntityData(profile);
    const newData = {
      ...baseData,
      email: profile.email,
      fillTempValues: true,   // fill semi-required things that are missing
      profileComplete: false  // have the user review it
    };
    return newData;
  }

  async authenticate(authentication, originalParams){
    return await authenticateCustom(authentication, originalParams);
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
