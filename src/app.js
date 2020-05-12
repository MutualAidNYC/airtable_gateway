'use strict';
// Config variables set via heroku
const config = require('./config');
const express = require('express');
const loader = require('./loaders');

const startServer = () => {
  const app = express();
  console.log('Starting the engines!');
  loader(app);

  app.listen(config.port, () => {
    console.log('MANYC Airtable-Gateway Server running on port ' + config.port);
  });
};

startServer();
