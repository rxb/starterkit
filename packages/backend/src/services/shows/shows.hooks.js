
// HANDLE RESULT
// massage the data before sending to the client
const handleResult = (result) => {

  // photo urlify
  if(result.photoId){
    // photoUrl is a virtual field
    // defined in the model as DataTypes.VIRTUAL
    // https://sequelize-guides.netlify.com/virtual-columns/
    result.photoUrl = `http://localhost:3030/photos/${result.photoId}`
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
          context.data.photoId = upload.id;
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
        // there's a way to package up this into a cleaner hook
        hook.result.data = hook.result.data.map(result => handleResult(result));
        return hook;
      }
    ],
    get: [
      hook => {
        hook.result = handleResult(hook.result);
        return hook;
      }
    ],
    create: [
      hook => {
        hook.result = handleResult(hook.result);
        return hook;
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
