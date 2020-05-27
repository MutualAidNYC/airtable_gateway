'use strict';
const updateAirtableRowObj = require('./updateAirtableRow');
const config = require('../config');

const recallNeedsRequest = (manycId) => {
  const fieldsToUpdate = {
    status: 'Recalled',
  };
  return updateAirtableRowObj.updateAirtableRow(
      config.airtable.key,
      config.airtable.baseId,
      config.airtable.tableName,
      fieldsToUpdate,
      manycId,
  );
};

module.exports = {recallNeedsRequest};
