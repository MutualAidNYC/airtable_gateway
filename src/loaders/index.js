'use strict'
const expressLoader = require('./express')
const airtablePoller = require('../service/airtablePoller')

module.exports = (app) => {
  expressLoader(app)
  console.log('Express Loaded!')
  airtablePoller()
}
