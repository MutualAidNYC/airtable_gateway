'use strict'
const airtableHelper = require('../../service/addAirTableRow')

module.exports = (app) => {

  app.post('/createRequest', async function (req, res) {
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
}
