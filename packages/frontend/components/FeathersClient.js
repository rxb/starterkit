// FEATHERS CLIENT - just using this for auth, once instantiated, we can share
import feathers from '@feathersjs/client';
export const apiHost = process.env.NEXT_PUBLIC_API_HOST;
const feathersClient = feathers();

// different config depending if browser or ssr
const authenticationOptions = {};
if (process.browser) {
  authenticationOptions["storage"] = window.localStorage
}
const thisFetch = (process.browser) ? window.fetch.bind(window) : fetch;

feathersClient.configure(feathers.authentication(authenticationOptions));
feathersClient.configure(feathers.rest(apiHost).fetch(thisFetch));

export default feathersClient;