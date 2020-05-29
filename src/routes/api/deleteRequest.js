'use strict';
const recallNeedsRequestObj = require('../../service/recallNeedsRequest');

module.exports = (app) => {
  app.post('/deleteRequest', async function(req, res) {
    const newRequest = req.body;
    // console.log('recallNeedsRequest: %o', recallNeedsRequest);
    try {
      await recallNeedsRequestObj.recallNeedsRequest(newRequest.manyc.id);
    } catch (error) {
      // fail silently!
    }
    res.send('Request deleted');
  });
};
