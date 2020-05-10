// Config variables set via heroku
const HEROKU_AIR_KEY = process.env.AIRTABLE_KEY;
const HEROKU_AIR_BASE_ID = process.env.AIRTABLE_BASE;
const HEROKU_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const MANYC_NEW_REQ_URL = process.env.MANYC_NEW_REQ;
const MANYC_UPDATE_REQ_URL = process.env.MANYC_UPDATE_REQ;
const MANYC_DELETE_REQ_URL = process.env.MANYC_DELETE_REQ;

const path = require('path');
const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');
const AirtableHelper = require('./src/addAirTableRow')

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const port = process.env.PORT;
app.listen(port, () => {
  console.log('MANYC Airtable-Gateway Server running on port ' + port);
});

/* Client Column Mapping Form */
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/mapping_form.html'));
});

// Client New Needs Request to MANYC Object
let clientColumnMapping = {};

app.get('/api/getColumnMapping', (req, res, next) => {
  if (Object.keys(clientColumnMapping).length > 0) {
    res.send(JSON.stringify(clientColumnMapping));
  } else {
    res.send('Column Mapping not set yet ...')
  }
});

app.post('/api/setColumnMapping', function (req, res) {
  clientColumnMapping = {
    status: req.body.status,
    id: req.body.id,
    supportType: req.body.supportType,
    otherSupport: req.body.otherSupport,
    community: req.body.community,
    language: req.body.language,
    languageOther: req.body.languageOther,
    phone: req.body.phone,
    email: req.body.email,
    fullName: req.body.fullName,
    urgency: req.body.urgency,
    contactMethod: req.body.contactMethod,
    crossStreet: req.body.crossStreet,
    timestampCreated: req.body.timestampCreated,
    timestampSent: req.body.timestampSent,
    source: req.body.source,
    sourceID: req.body.sourceID,
  };
  console.log(clientMapping);
  res.send('MANYC Airtable-Gateway Client Mapping Set');
});

// MANYC Sends to Group Object
app.post('/api/createRequest', function (req, res) {
  newRequest = {
    manyc: {
      status: req.body.status,
      id: req.body.id,
      supportType: req.body.supportType,
      otherSupport: req.body.otherSupport,
      community: req.body.community,
      language: req.body.language,
      languageOther: req.body.languageOther,
      phone: req.body.phone,
      email: req.body.email,
      fullName: req.body.fullName,
      urgency: req.body.urgency,
      contactMethod: req.body.contactMethod,
      crossStreet: req.body.crossStreet,
      timestampCreated: req.body.timestampCreated,
      timestampSent: req.body.timestampSent,
      source: req.body.source,
      sourceID: req.body.sourceID,
    }
  };
  console.log(newRequest);
  AirtableHelper(HEROKU_AIR_KEY, HEROKU_AIR_BASE_ID, HEROKU_TABLE_NAME, [newRequest]);
  res.send('MANYC Airtable-Gateway Needs Request Created');
});

/* ----------------------------------------------------------------*/
/* Airtable Polling Section */
/* ----------------------------------------------------------------*/
const base = new Airtable({ apiKey: HEROKU_AIR_KEY }).base(HEROKU_AIR_BASE_ID);
const ChangeDetector = require('airtable-change-detector');

const airtableGatewayDetector = new ChangeDetector(
  base(HEROKU_TABLE_NAME), {
  writeDelayMs: 100,
  metaFieldName: 'Meta', // Defaults to `Meta`
  lastModifiedFieldName: 'Last Modified', // Defaults to `Last Modified`
  lastProcessedFieldName: 'Last Processed',
},
);

airtableGatewayDetector.pollWithInterval(
  'pollingNameForLogging',
  10000, // interval in milliseconds
  async (recordsChanged) => {
    const numChanges = recordsChanged.length;
    console.info(`Found ${numChanges} changes in ` + HEROKU_TABLE_NAME);
    const promises = [];
    recordsChanged.forEach((record) => {
      console.log(record.fields);
      promises.push(axios.post(MANYC_NEW_REQ_URL, {
        // TODO Create Request Body
      }));
    });

    // If doing many Airtable writes, be careful of 5rps rate limit
    return Promise.all(promises);
  },
);
