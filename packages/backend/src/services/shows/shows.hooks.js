
// HANDLE RESULT
// massage the data before sending to the client
const handleResult = (result) => {

  // photo urlify
  if(result.photo && !result.photo.startsWith('http')){
    result.photo = `http://localhost:3030/photos/${result.photo}`
  }

  return result;
}


module.exports = {
  before: {
    all: [],
    find: [
      (context) => {
        const sequelize = context.app.get('sequelizeClient');
        const { ShowComments, users } = sequelize.models;
        context.params.sequelize = {
          raw: false, // don't know why, but it needs this to not flatten the children
          include: [ {
            model: ShowComments,
            include: [ users ]
          } ]
        }
        return context;
      }
    ],
    get: [
      (context) => {
        const sequelize = context.app.get('sequelizeClient');
        const { ShowComments, users } = sequelize.models;
        context.params.sequelize = {
          raw: false, // don't know why, but it needs this to not flatten the children
          include: [ {
            model: ShowComments,
            include: [ users ]
          } ]
        }
        return context;
      }
    ],
    create: [
      async (context) => {
        if(context.data.uri){
          // insert photo and get id for reference
          const upload = await context.app.service('uploads').create({
            uri: context.data.uri
          })
          delete context.uri;
          context.data.photo = upload.id;
        }
        return context;
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hook => {
        hook.result.data.forEach(result => {
          handleResult(result)
        })
      }
    ],
    get: [
      hook => {
        handleResult(hook.result)
      }
    ],
    create: [
      hook => {
        handleResult(hook.result)
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
