require('isomorphic-fetch');

const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { express: oauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');


// FACEBOOK STRATEGY
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
      email: profile.email,
      url: `https://graph.facebook.com/${profile.id}/picture?width=500`
    };
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
      url: profile.picture
    };
    return newData;
  }
}

class RedditStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    console.log('REEEEDDDDDDITTTT');
    console.log(profile);

    // this will set 'redditId'
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      name: profile.name,
      url: profile.icon_img
    }
  }
}


module.exports = function (app) {
  const authentication = new AuthenticationService(app);
  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('facebook', new FacebookStrategy());
  authentication.register('google', new GoogleStrategy());
  authentication.register('reddit', new RedditStrategy());

  app.use('/authentication', authentication);
  app.configure(oauth());
};