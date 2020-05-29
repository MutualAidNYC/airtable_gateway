'use strict';
const Airtable = require('airtable');
const config = require('../config');
const util = require('util');

const updateAirtableRow = async (
  apiKey,
  baseId,
  tableName,
  updateRecord,
  uniqueId,
  fieldValueMap = config.fieldMap,
) => {
  Airtable.configure({apiKey});
  const base = Airtable.base(baseId);
  const table = base(tableName);
  const firstPage = util.promisify(
      table.select({
        filterByFormula: `${config.fieldMap.id} = "${uniqueId}"`,
      }).firstPage,
  );

  const records = await firstPage();

  // throw informative errors
  if (records.length === 0) {
    throw new Error('Record to update, not found');
  } else if (records.length > 1) {
    throw new Error('Record ID is not unique');
  }

  const airtableRecordId = records[0].getId();
  const update = util.promisify(table.update);

  const updateObj = {
    id: airtableRecordId,
    fields: {},
  };

  // translate the values
  const keys = Object.keys(updateRecord);
  keys.forEach((key) => {
    const translatedKey = fieldValueMap[key];
    updateObj.fields[translatedKey] = updateRecord[key];
  });

  return update([updateObj]);
};

module.exports = {updateAirtableRow};
