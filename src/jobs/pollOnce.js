'use strict'

const airtablePoller = require('../service/airtablePoller')

console.log('Single poll triggered by a cron job')
airtablePoller.pollOnce()
