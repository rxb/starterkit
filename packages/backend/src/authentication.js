const { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');


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

  // don't update user entity with new oauth info (why would anyone do that?)
  const authEntity = !existingEntity ? await this.createEntity(profile, params)
    : existingEntity;

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
    return await authenticateCustom.call(this, authentication, originalParams);
  }
}

class AppleStrategy extends OAuthStrategy {
  
  async getProfile (data, _params) {
    return data.jwt.id_token.payload;
  }

  async getEntityData(profile) {  
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
    return await authenticateCustom.call(this, authentication, originalParams);
  }
  
}

/*
class RedditStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    // this will set 'redditId'
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      name: profile.name,
      url: profile.icon_img
    }
  }
}
*/

module.exports = app => {
  const authentication = new AuthenticationService(app);
  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('anonymous', new AnonymousStrategy());
  authentication.register('google', new GoogleStrategy());
  authentication.register('apple', new AppleStrategy());
  // authentication.register('reddit', new RedditStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
