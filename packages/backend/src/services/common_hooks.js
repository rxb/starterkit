const { protect } = require('@feathersjs/authentication-local').hooks;
const { iff, isProvider, preventChanges } = require('feathers-hooks-common');
const _ = require('lodash');

module.exports = {

  // REST has trouble submitting null
  // and some validations really need null, not an empty string
  convertFalsyToNull: (options) => {
    const fields = options.fields;
    return async (context) => {
      fields.forEach( f => {
        if( !context.data[f] ){
          context.data[f] = null
        }
      });
      return context;
    }
  },


  checkForSelfId: (options) => {
    const { key } = options;
    // sets id to the id of logged-in user when "self" used as id
    return async (context) => {
      const possibleSelf = _.get(context, key);
      if (_.get(context, key) == "self") {
        if (context.params.user) {
          _.set(context, key, context.params.user.id);
        }
        else {
          throw new Error("Need to log in to get your user info");
        }
      }
      return context;
    }
  },

  protectUserFields: (prefix = "", allowFieldsOrFn) => {
    let fields = ['password', 'verifyToken', 'verifyShortToken', 'verifyExpires', 'verifyChanges', 'resetToken', 'resetShortToken', 'resetExpires', 'facebookId', 'googleId', 'redditId', 'appleId', 'email', 'notifyOwnedIssues', 'notifyParticipatedIssues'];
    
    return async (context) => {
      // expose specific (normally protected) fields
      const allowFields = (allowFieldsOrFn instanceof Function) 
        ? allowFieldsOrFn(context) : allowFieldsOrFn;
      if(allowFields){
        fields = fields.filter( ( f ) => !allowFields.includes( f ) );
      }

      // sometimes it's in an association and has a prefix like author.
      const prefixedFields = fields.map(field => prefix + field);

      // only do any of this if it's an external call
      if(isProvider('external')){
        context = protect(...prefixedFields)(context);
      }
      return context;
    }
  },

  setDefaultSort: (options) => {
    const { field, order } = options;
    return (context) => {
      const { query = {} } = context.params;
      if (!query.$sort) {
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

      if (params.provider && !params.authentication) {
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
    return async (context) => {
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
      ...options
    };

    return async (context) => {

      const hasImageToUpload = (context.data[opts.dataUriKey] || context.data[opts.urlKey] || context.params[opts.fileKey]);

      if (hasImageToUpload) {
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