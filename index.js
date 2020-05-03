const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const port = process.env.PORT;
app.listen(port, () => {
  console.log('MANYC Airtable-Gateway Server running on port ' + port);
});

/* Client Mapping Form */
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/mapping_form.html'));
});

/* Client Mapping API */
let clientMapping = {};

app.get('/api/getMapping', (req, res, next) => {
  res.send(JSON.stringify(clientMapping));
});

app.post('/api/setMapping', function(req, res) {
  clientMapping = {
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
  };
  console.log(clientMapping);
  res.send('MANYC Airtable-Gateway Client Mapping Set');
});

app.post('/api/createRequest', function(req, res) {
  newRequest = {
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
  };
  console.log(newRequest);
  res.send('MANYC Airtable-Gateway Client Mapping Set');
});


/* ----------------------------------------------------------------*/
/* Airtable Polling Section */
/* ----------------------------------------------------------------*/

// Config variables set via heroku
const HEROKU_AIR_KEY = '';
const HEROKU_AIR_BASE_ID = '';
const HEROKU_TABLE_NAME = 'Individual Needs Requests';

const axios = require('axios');
const Airtable = require('airtable');
const base = new Airtable({apiKey: HEROKU_AIR_KEY}).base(HEROKU_AIR_BASE_ID);

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
    const numChanges = records.Changed.length;
    console.info(`Found ${numChanges} changes in ` + HEROKU_TABLE_NAME);
    const promises = [];
    recordsChanged.forEach((record) => {
      console.log(record.fields);
      promises.push(axios.post('http://localhost:8001/api/createRequest', {
        // TODO Create Request Body
      }));
    });

    // If doing many Airtable writes, be careful of 5rps rate limit
    return Promise.all(promises).catch;
  },
);
