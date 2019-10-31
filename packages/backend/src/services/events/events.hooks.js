const KEYS = require('../../../keys');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeGeocoder = require('node-geocoder');

const coords = {
  latitude: 40.726910472048125,
  longitude: -73.94930072674808
};

module.exports = {
  before: {
    all: [],
    find: [
      (context) => {
        // sorting is only find-relevant
        // if you put it in other hooks, they get weird
        const { query = {} } = context.params;
        if(!query.$sort) {
          query.$sort = {
            'createdAt': -1
          }
        }
        context.params.query = query;
        return context;
      },
    ],
    get: [],
    create: [
      async (context) => {

        // Get JSON-LD of event page
        const urlResponse = await axios.get(context.data.url);
        const $ = cheerio.load(urlResponse.data);
        const elements = $('script[type="application/ld+json"]');
        const sourceData = JSON.parse(elements.first().html());
        // need to bail if no json-ld


        // check for location data
        let locationData = {};
        let missingLocationData = false;
        if(sourceData.location){
          locationData.name = sourceData.location.name;
          if(sourceData.location.geo){
            locationData.latitude = sourceData.location.geo.latitude;
            locationData.longitude = sourceData.location.geo.longitude;
          }
          else{
            missingLocationData = true;
          }

          if(sourceData.location.address){
            locationData.city = sourceData.location.address.addressLocality;
            locationData.country = sourceData.location.address.addressCountry;
            locationData.streetAddress = sourceData.location.address.streetAddress;
            locationData.postalCode = sourceData.location.address.postalCode;
          }
          else{
            missingLocationData = true;
          }

          // attempt to fill in location information
          if(missingLocationData){
            const geocoder = NodeGeocoder({provider: 'google', 'apiKey': KEYS.google});
            const locationString = Object.values(locationData).join(' '); // everything we have
            const locationResponse = await geocoder.geocode( locationString );
            const locationObject = locationResponse[0];
            locationData = {
              ...locationData,
              latitude: locationObject.latitude,
              longitude: locationObject.longitude,
              city: locationObject.city,
              country: locationObject.country,
              postalCode: locationObject.zipcode,
              streetAddress: `${locationObject.streetNumber} ${locationObject.streetName}`,
            };
          }
          sourceData.locationData = locationData;
        }

        const extraData = {
          sourceData: sourceData,
          title: sourceData.name,
          startDate: sourceData.startDate,
          locationName: locationData.name,
          city: locationData.city,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        }
        context.data = {...context.data, ...extraData};
        return context;
      },
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
