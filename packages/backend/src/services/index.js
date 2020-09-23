const shows = require('./shows/shows.service.js');
const users = require('./users/users.service.js');
const showComments = require('./show-comments/show-comments.service.js');
const uploads = require('./uploads/uploads.service.js');
const tags = require('./tags/tags.service.js');
const showsTags = require('./shows_tags/shows_tags.service.js');
const events = require('./events/events.service.js');
const tldrs = require('./tldrs/tldrs.service.js');
const tldrVersions = require('./tldr_versions/tldr_versions.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(shows);
  app.configure(users);
  app.configure(showComments);
  app.configure(uploads);
  app.configure(tags);
  app.configure(showsTags);
  app.configure(events);
  app.configure(tldrs);
  app.configure(tldrVersions);
};
