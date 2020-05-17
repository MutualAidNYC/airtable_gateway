'use strict';

module.exports = (app) => {
  app.post('/setColumnMapping', function(req, res) {
    const clientColumnMapping = {
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
    console.log(clientColumnMapping);
    res.send('MANYC Airtable-Gateway Client Mapping Set');
  });
};
