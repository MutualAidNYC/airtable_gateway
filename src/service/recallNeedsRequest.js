'use strict';
const Airtable = require('airtable');
const config = require('../config');
const util = require('util');

const recallNeedsRequest = async (manycId) => {
  Airtable.configure({apiKey: config.airtable.key});
  const base = Airtable.base(config.airtable.baseId);
  const table = base(config.airtable.tableName);
  const firstPage = util.promisify(
      table.select({
        filterByFormula: `${config.fieldMap.id} = "${manycId}"`,
      }).firstPage,
  );
  const records = await firstPage();
  if (records.length !== 1) {
    throw new Error('Couldn\'t find exactly 1 record with the ID');
  }
  // assume for now 1 record
  const airtableRecordId = records[0].getId();
  const update = util.promisify(table.update);

  const updateObj = {
    id: airtableRecordId,
    fields: {},
  };
  updateObj.fields[config.fieldMap.status] = 'Recalled';
  return update([updateObj]);
};

module.exports = {recallNeedsRequest};
