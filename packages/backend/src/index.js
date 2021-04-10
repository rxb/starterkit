/* eslint-disable no-console */

/*
// non-https config 
// for production, the recommendation is setting up behind "nginx reverse-proxy" 
// for now, lalala not listening
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
app.listen(3030).then(server => {

  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );

  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)

});
*/

// expressjs https config needed to test apple oauth
// because they are crazy people
const https = require('https');
const fs = require("fs");
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');

const server = https.createServer({
  key: fs.readFileSync('/Users/Richard/localhost.key'),
  cert: fs.readFileSync('/Users/Richard/localhost.crt')
}, app).listen(443);

app.setup(server).then(server => {
  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
});