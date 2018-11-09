// POPULATE PHOTO URL
// photoUrl is a DataTypes.VIRTUAL field
// https://sequelize-guides.netlify.com/virtual-columns/
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

// HANDLE NEW IMAGE
const saveAndGetNewImageReference = async (context) => {
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


// POPULATE EXTRA SHOWCOMMENTS (and users/authors)
const populateShowComments = (context) => {
  const sequelize = context.app.get('sequelizeClient');
  const { ShowComments, users, tags } = sequelize.models;
  context.params.sequelize = {
    raw: false, // don't know why, but it needs this to not flatten the children
    include: [
      {
        model: ShowComments,
        include: [ users ]
      },
      {
        model: tags,
        as: 'tags'
      }
    ]
  }
  return context;
}


// ASSOCIATE TAGS (many-to-many)
const associateTags = async (context) => {
  const associations = context.data.tags.map( tag => ({tagId: tag.id, showId: context.data.id}) );
  // TODO: would be better if this were a transaction, but i'm not going to stress about it at the moment
  await context.app.service('shows-tags').remove(null, {query: {showId: context.data.id}});
  await context.app.service('shows-tags').create(associations);
  return context;
}


module.exports = {
  before: {
    all: [],
    find: [
      populateShowComments
    ],
    get: [
      populateShowComments
    ],
    create: [
      saveAndGetNewImageReference
    ],
    update: [
      saveAndGetNewImageReference
    ],
    patch: [
      saveAndGetNewImageReference,
    ],
    remove: []
  },

  after: {
    all: [
      populatePhotoUrl
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      associateTags
    ],
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
