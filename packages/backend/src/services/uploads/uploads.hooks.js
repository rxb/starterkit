const dauria = require('dauria');
const sharp = require('sharp');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [

        // upload should be able to aceept
        // a base64 uri image, but also...
        (hook) => {
          let fileBuffer;

          // a multipart image file
          if(hook.params.file){
            const file = hook.params.file;
            fileBuffer = file.buffer;
          }

          // a url to a remote image
          if(context.data.url){
            const urlImage = await axios.get(context.data.url, {responseType: 'arraybuffer'});
            fileBuffer = Buffer.from(urlImage.data);
          }

          // convert those to base64 uri image
          if(fileBuffer){
            const dataUri = fileBuffer.toString('base64');
            hook.data = {dataUri: dataUri};
          }

          return hook;
        },

        // process image
        async (hook) => {
          const dataUri = hook.data.dataUri.split(';base64,').pop();
          const inBuffer = Buffer.from(dataUri, 'base64');
          const outBuffer = await sharp(inBuffer)
            .resize(500)
            .jpeg()
            .toBuffer();
          hook.data.dataUri = `data:image/jpeg;base64,${outBuffer.toString('base64')}`;
          return hook;
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
