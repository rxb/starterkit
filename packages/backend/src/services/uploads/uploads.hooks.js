const dauria = require('dauria');
const sharp = require('sharp');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [

        // become base64 for consistency
        (hook) => {
          if (!hook.data.uri && hook.params.file){
              // convert regular old files to base64 for blob
              const file = hook.params.file;
              const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
              hook.data = {uri: uri};
          }
          return hook;
        },

        async (hook) => {
          const uri = hook.data.uri.split(';base64,').pop();
          const inBuffer = Buffer.from(uri, 'base64');
          const outBuffer = await sharp(inBuffer)
            .resize(500, 500)
            .greyscale()
            .toBuffer();
          hook.data.uri = `data:image/png;base64,${outBuffer.toString('base64')}`;
          return hook;
        }

        /*
        // process image
        async (hook) => {
          const uri = await sharp(hook.data.uri)
            .greyscale()
            .toString('base64');
          hook.data = {uri: uri};
        }
        */

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
