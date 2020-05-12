'use strict';

module.exports = (app) => {
  app.get('/getColumnMapping', (_req, res) => {
    // if (Object.keys(clientColumnMapping).length > 0) {
    //   res.send(JSON.stringify(clientColumnMapping));
    // } else {
    res.send('Column Mapping not set yet ...');
    // }
  });
};
