module.exports = {

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