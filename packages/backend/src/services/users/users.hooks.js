const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const { queryWithCurrentUser } = require('feathers-authentication-hooks');
const http = require('http');

const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

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
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      async (context) => {
        console.log('post create');

        // TEMP: give everyone same photo from url
        // fetch photo from url
        const fakeFileUrl = 'https://randomuser.me/api/portraits/women/9.jpg'

        http.get(fakeFileUrl, (resp) => {
            resp.setEncoding('base64');
            body = "data:" + resp.headers["content-type"] + ";base64,";
            resp.on('data', (data) => { body += data});
            resp.on('end', () => {
                console.log(body);
                //return res.json({result: body, status: 'success'});
            });
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);
        });
        console.log('got the photo');


        // upload photo for user and get local info
        const photo = await context.app.service('uploads').create({}, {file: photoFile});
        console.log('post upload');


        // update user with photo
        context.result = await context.service.update(context.result.id, {photoId: photo.photoId, photoUrl: photo.photoUrl});
        console.log('post update');

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
