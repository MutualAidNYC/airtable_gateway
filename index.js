// Config variables set via heroku
const config = require('./src/config');
const path = require('path');
const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');
const airtableHelper = require('./src/addAirTableRow');

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
    res.send('Column Mapping not set yet ...');
  }
});

app.post('/api/setColumnMapping', function(req, res) {
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
app.post('/api/createRequest', async function(req, res) {
  const newRequest = req.body;
  try {
    await airtableHelper(
        config.airtable.key,
        config.airtable.baseId,
        config.airtable.tableName,
        [newRequest],
    );
  } catch (error) {
    console.log('error: ', error);
  }
  res.send('MANYC Airtable-Gateway Needs Request Created');
});

/* ----------------------------------------------------------------*/
/* Airtable Polling Section */
/* ----------------------------------------------------------------*/
const base = new Airtable({apiKey: config.airtable.key})
    .base(config.airtable.baseId);
const ChangeDetector = require('airtable-change-detector');

const airtableGatewayDetector = new ChangeDetector(
    base(config.airtable.tableName), {
      writeDelayMs: 100,
      metaFieldName: 'Meta', // Defaults to `Meta`
      lastModifiedFieldName: 'AirTable Gateway Last Modified',
      lastProcessedFieldName: 'Airtable Gateway Last Processed',
    },
);

airtableGatewayDetector.pollWithInterval(
    'pollingNameForLogging',
    10000, // interval in milliseconds
    async (recordsChanged) => {
      const numChanges = recordsChanged.length;
      const msg = `Found ${numChanges} changes in ` + config.airtable.tableName;
      console.info(msg);
      const promises = [];
      recordsChanged.forEach((record) => {
        if (Object.keys(record.getMeta().lastValues).length === 0) return;
        let status;
        const justCantArr = [
          'In Progress - We Can’t Take Responsibility for This Anymore',
          'EMERGENCY- Has Urgent Needs to be filled; that we cannot!',
        ];
        const completedArr = [
          'Resolved - Follow up next week',
          'Resolved - Able to Fill Need',
          'Resolved - Cancelled',
        ];
        const assignedArr = [
          'In Progress- Unable to contact',
          'In Progress - We Take Responsibility For This',
        ];
        if (justCantArr.includes(record.fields.Status)) {
          status = 'justCant';
        } else if (completedArr.includes(record.fields.Status)) {
          status = 'completed';
        } else if (assignedArr.includes(record.fields.Status)) {
          status = 'assigned';
        } else {
          return;
        }
        promises.push(axios.post(config.url.newReq, {
          manyc: {
            status, // justCant || completed || assigned
            id: record.fields['Unique ID'],
            groupClaiming:
            record.fields['Group Claiming'] || null, // not always present
            notes: record.fields['Note'] || null, // not always present
          },
        }));
      });

      // If doing many Airtable writes, be careful of 5rps rate limit
      return Promise.all(promises);
    },
);
