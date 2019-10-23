const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const { queryWithCurrentUser } = require('feathers-authentication-hooks');
const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

const {
  populatePhotoUrl,
  saveAndGetNewImageReference
} = require('../common_hooks.js');

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
    create: [
      hashPassword('password'),
      saveAndGetNewImageReference
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt'),
      saveAndGetNewImageReference
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      saveAndGetNewImageReference
    ],
    remove: [
      authenticate('jwt')
    ]
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
      /*
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

      }, */
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
