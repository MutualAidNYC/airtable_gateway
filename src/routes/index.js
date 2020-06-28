'use strict';
const apiRoute = require('./api');

module.exports = (app) => {
  app.use('/api', apiRoute());
  return app;
};
