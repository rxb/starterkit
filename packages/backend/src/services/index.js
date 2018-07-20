const shows = require('./shows/shows.service.js');
const users = require('./users/users.service.js');
const showComments = require('./show-comments/show-comments.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(shows);
  app.configure(users);
  app.configure(showComments);
};
