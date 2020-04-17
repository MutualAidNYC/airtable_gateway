const path = require('path');
const express = require('express');

const app = express();
let bodyParser = require('body-parser');
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
