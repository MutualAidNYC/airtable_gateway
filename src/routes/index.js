const { Router } = require('express')
const api = require('./api')

module.exports = (app) => {
  // const app = Router();
  app.use('/api', api())
  // getColumnMapping(app)
  // setColumnMapping(app)
  // createRequest(app)

  return app
}
