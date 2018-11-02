

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
          const upload = await context.app.service('uploads').create({
            uri: context.data.uri
          })
          delete context.uri;
          context.data.photo = upload.id;
        }
        return context;
        /*
        console.log('here we are creating a show');
        const wait = () => new Promise(resolve => {
          console.log('waiting');
          setTimeout(resolve, 500)
        });
        return await wait();
        */
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
