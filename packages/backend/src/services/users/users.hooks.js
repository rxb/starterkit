const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const { queryWithCurrentUser } = require('feathers-authentication-hooks');
const axios = require('axios');

const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;


// POPULATE PHOTO URL
// photoUrl is a DataTypes.VIRTUAL field
// https://sequelize-guides.netlify.com/virtual-columns/
// TODO: there should probably only be one of these functions... find all of them in the other hooks files
const populatePhotoUrl = (context) => {
  const buildPhotoUrl = (result) => {
    if(result.photoId){
      result.photoUrl = `http://localhost:3030/photos/${result.photoId}`

    }
    return result;
  }
  if (context.result.data) {
      context.result.data = context.result.data.map(item => buildPhotoUrl(item));
  } else {
      context.result = buildPhotoUrl(context.result);
  }
  return context;
}


module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      // this is probably inefficient to always auth
      authenticate('jwt', {allowUnauthenticated: true}),
      (context) => {
        // this probably should fail in a redirect way
        // if you try to "self" a non-logged in request
        if (context.id == 'self') {
          if(context.params.user){
            context.id = context.params.user.id;
          }
        }
        return context;
      },
    ],
    create: [ hashPassword('password') ],
    update: [ hashPassword('password'), authenticate('jwt') ],
    patch: [ hashPassword('password'), authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      populatePhotoUrl,
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      async (context) => {
        // fetch photo from url
        const fakeFileUrl = 'https://randomuser.me/api/portraits/women/9.jpg'
        const image = await axios.get(fakeFileUrl, {responseType: 'arraybuffer'});
        const returnedB64 = Buffer.from(image.data).toString('base64');

        // upload photo for user and get local info
        const photo = await context.app.service('uploads').create({uri: returnedB64});

        // update user with photo
        context.result = await context.service.patch(context.result.id, {photoId: photo.id});
        return context;
      },
    ],
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
