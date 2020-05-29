'use strict';
const {Router} = require('express');
const getColumnMapping = require('./getColumnMapping');
const setColumnMapping = require('./setColumnMapping');
const createRequest = require('./createRequest');
const deleteRequest = require('./deleteRequest');

module.exports = () => {
  const app = Router(); // eslint-disable-line new-cap

  getColumnMapping(app);
  setColumnMapping(app);
  createRequest(app);
  deleteRequest(app);

  return app;
};
