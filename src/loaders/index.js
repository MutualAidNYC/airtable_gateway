'use strict';
const expressLoader = require('./express');
const airtablePoller = require('../service/airtablePoller');
const config = require('../config');

module.exports = (app) => {
  expressLoader(app);
  console.log('Express Loaded!');
  if (config.isFreeHerokuDyno) {
    console.log('On free Heroku, not polling');
  } else {
    airtablePoller.poll();
  }
};
