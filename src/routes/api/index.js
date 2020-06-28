'use strict';
const {Router} = require('express');
const createRequest = require('./createRequest');
const deleteRequest = require('./deleteRequest');
const getColumnMapping = require('./getColumnMapping');
const setColumnMapping = require('./setColumnMapping');

module.exports = () => {
  const app = Router(); // eslint-disable-line new-cap
  createRequest(app);
  deleteRequest(app);
  getColumnMapping(app);
  setColumnMapping(app);
  return app;
};
