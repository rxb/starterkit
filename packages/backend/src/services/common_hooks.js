const { protect } = require('@feathersjs/authentication-local').hooks;
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');

module.exports = {

  protectUserFields: (prefix = "") => { 
    const fields = ['password', 'verifyToken', 'verifyShortToken', 'verifyExpires', 'verifyChanges', 'resetToken', 'resetShortToken', 'resetExpires', 'facebookId', 'googleId', 'redditId', 'appleId'];
    const prefixedFields = fields.map( field => prefix + field );
    return iff( isProvider('external'), protect( ...prefixedFields ) );
  },

  setDefaultSort: (options) => {
    const {field, order} = options;
    return (context) => {
      const { query = {} } = context.params;
      if(!query.$sort) {
        query.$sort = {
          [field]: order
        }
      }
      context.params.query = query;
      return context;
    }
  },

  // hook for anonymous auth situations
  // (ie when an api would do additional work for an authorized user, but still allows an anonymous user)
  allowAnonymous: (options = {}) => { 
    return async context => {
      const { params } = context;
  
      if(params.provider && !params.authentication) {
        context.params = {
          ...params,
          authentication: {
            strategy: 'anonymous'
          }
        }
      }
  
      return context;
    };
  },

  // REFRESH FULL OBJECT FROM DB
  getFullModel: (options) => {
    return async(context) => {
      // setting .dispatch because it's the the override return attribute 
      // (doesn't include protected files)
      context.dispatch = await context.service.get(context.result.id, context.params);
      return context;
    }
  },


  // SAVE AND GET NEW IMAGE REFERENCE
  saveAndGetNewImageReference: (options = {}) => {

    const opts = {
      foreignPhotoKey: 'photoId',
      dataUriKey: 'dataUri', // uplodaed base64 image
      fileKey: 'file', // multipart file
      urlKey: 'url', // url of remote image
      ...options};

    return async (context) => {

      const hasImageToUpload = (context.data[opts.dataUriKey] || context.data[opts.urlKey] || context.params[opts.fileKey] );

      if(hasImageToUpload){
        const data = {
          dataUri: context.data[opts.dataUriKey],
          url: context.data[opts.urlKey]
        };
        const params = {
          file: context.params[opts.fileKey]
        };
        const upload = await context.app.service('uploads').create(data, params);
        context.data[opts.foreignPhotoKey] = upload.id;
      }
     
      return context;
    }
  }
}