const { Router } = require('express')
const getColumnMapping = require('./getColumnMapping')
const setColumnMapping = require('./setColumnMapping')
const createRequest = require('./createRequest')

module.exports = () => {
  const app = Router();

  getColumnMapping(app)
  setColumnMapping(app)
  createRequest(app)

  return app
}
