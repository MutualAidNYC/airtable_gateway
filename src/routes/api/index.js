'use strict';
const {Router} = require('express');
const createRequest = require('./createRequest');
const deleteRequest = require('./deleteRequest');

module.exports = () => {
  const app = Router(); // eslint-disable-line new-cap
  createRequest(app);
  deleteRequest(app);
  return app;
};
