const dauria = require('dauria');
const sharp = require('sharp');
const axios = require('axios');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [

        // upload should be able to aceept
        // a base64 uri image, but also...
        async (context) => {
          let fileBuffer, fileMime;

          // a multipart image file
          if(context.params.file){
            const file = context.params.file;
            fileBuffer = file.buffer;
            fileMime = file.mimeType;
          }

          // a url to a remote image
          if(context.data.url){
            const urlImage = await axios.get(context.data.url, {responseType: 'arraybuffer'});
            fileBuffer = Buffer.from(urlImage.data);
            fileMime = 'image/jpeg'; // whatevs
          }

          // convert those to base64 uri image
          if(fileBuffer){
            const dataUri = dauria.getBase64DataURI(fileBuffer, fileMime);
            context.data = {dataUri: dataUri};
          }

          return context;
        },

        // process image
        async (context) => {
          const dataUri = context.data.dataUri.split(';base64,').pop();
          const inBuffer = Buffer.from(dataUri, 'base64');
          const outBuffer = await sharp(inBuffer)
            .resize(500)
            .jpeg()
            .toBuffer();
          context.data.uri = dauria.getBase64DataURI(outBuffer, 'image/jpeg'); // feathers-blob really wants it to be called "uri"
          return context;
        }

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
