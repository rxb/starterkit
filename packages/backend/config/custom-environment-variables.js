var defer = require('config/defer').deferConfig;
var jwt = require('jsonwebtoken');

// sign in with apple
// https://medium.com/techulus/how-to-setup-sign-in-with-apple-9e142ce498d4
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
   expiresIn: '180d'
  });
 return token
 }

module.exports = {
   "authentication": {
   "oauth": {
      "redirect": "http://localhost:3000/tldr/oauth",
      "google": {
        "key": "STARTERKIT_GOOGLE_KEY",
        "secret": "STARTERKIT_GOOGLE_SECRET"
      },
      "apple": {
        "key": "STARTERKIT_APPLE_CLIENT_ID",
        "secret": getAppleClientSecret()
      }
    }
   }
}