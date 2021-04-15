var jwt = require('jsonwebtoken');

// sign in with apple
// https://medium.com/techulus/how-to-setup-sign-in-with-apple-9e142ce498d4
const getAppleClientSecret = () => {
	const privateKey = process.env.STARTERKIT_APPLE_PRIVATE_KEY;
	const keyId = process.env.STARTERKIT_APPLE_KEY_ID;
	const teamId = process.env.STARTERKIT_APPLE_TEAM_ID;
	const clientId = process.env.STARTERKIT_APPLE_CLIENT_ID;

  /*
	console.log(`privateKey ${privateKey}`);
	console.log(`keyId ${keyId}`);
	console.log(`teamId ${teamId}`);
	console.log(`clientId ${clientId}`);
  */

	const headers = {
		kid: keyId,
		typ: undefined
	}
	const claims = {
		'iss': teamId,
		'aud': 'https://appleid.apple.com',
		'sub': clientId,
	}
	token = jwt.sign(claims, privateKey, {
		algorithm: 'ES256',
		header: headers,
		expiresIn: '180d'
	});
	return token
}
process.env.STARTERKIT_APPLE_SECRET = getAppleClientSecret();

const config = {
  "authentication": {
	 "secret": "STARTERKIT_AUTHENTICATION_SECRET",
    "oauth": {
      "google": {
        "key": "STARTERKIT_GOOGLE_KEY",
        "secret": "STARTERKIT_GOOGLE_SECRET"
      },
      "apple": {
        "key": "STARTERKIT_APPLE_CLIENT_ID",
        "secret": "STARTERKIT_APPLE_SECRET"
      }
    }
  }
}
module.exports = config;