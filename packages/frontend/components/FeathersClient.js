// FEATHERS CLIENT - just using this for auth, once instantiated, we can share
import feathers from '@feathersjs/client';
export const apiHost = process.env.NEXT_PUBLIC_API_HOST;
const feathersClient = feathers();

const authenticationOptions = {};
if (process.browser) {
  authenticationOptions["storage"] = window.localStorage
}

feathersClient.configure(feathers.authentication(authenticationOptions));
feathersClient.configure(feathers.rest(apiHost).fetch(fetch));

export default feathersClient;