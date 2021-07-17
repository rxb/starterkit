// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.

  // get headers 
  app.use(function(req, res, next) {
    req.feathers.headers = req.headers;
    next();
  });

};
