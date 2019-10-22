require('isomorphic-fetch');

const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { express: oauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');


// extend strategy to pull in more user info
// https://docs.feathersjs.com/cookbook/authentication/facebook.html#getting-profile-data
class FacebookStrategy extends OAuthStrategy {
  async getProfile (authResult) {

    // This is the oAuth access token that can be used
    // for Facebook API requests as the Bearer token
    const accessToken = authResult.access_token;

    const response = await fetch('https://graph.facebook.com/me?fields=id,name,email,picture', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    return data;
  }

  async getEntityData(profile) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      name:  profile.name,
      email: profile.email
    };
  }
}


module.exports = function (app) {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('facebook', new FacebookStrategy());

  app.use('/authentication', authentication);
  app.configure(oauth());
};