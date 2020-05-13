'use strict';
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('../routes');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // default route: Client Column Mapping Form
  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'assets', 'mapping_form.html'));
  });

  routes(app);
};
