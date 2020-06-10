'use strict';
const Airtable = require('airtable');
const util = require('util');
const config = require('../config');

/**
 * Will add 1-10 records to a specified airtable base
 * @param {Object[]} records - Array of 1-10 records to add
 * @param {Object} fieldToValueMap - Object with records to field mapping
 * @return {Array} - Array of records in Airtable format
 */
const transformObjects = (records, fieldToValueMap) => {
  const transformedRecords = [];

  records.forEach((record) => {
    // for every provided record

    // create a new default airtable object
    const tranformedRecord = {fields: {}};

    for (const key in fieldToValueMap) {
      // for every key in the fieldToValueMap Object
      if (fieldToValueMap.hasOwnProperty(key)) {
        // if its not an inherited property
        const fieldName = fieldToValueMap[key]; // get the field name
        if (record.manyc[key] !== undefined) {
          // if the field exists in the provided record
          // add the value to the proper property in Airtable's record
          tranformedRecord.fields[fieldName] = record.manyc[key];
        }
      }
    }
    // add the completed record to the return array
    transformedRecords.push(tranformedRecord);
  });
  return transformedRecords;
};

/**
 * Will add 1-10 records to a specified airtable base it is reconmended that
 * you 'catch' any errors from airtable using a async try-catch or a .then.catch
 * chain
 *
 * WARNING: the api has a limit of FIVE REQUESTS PER "SECOND" per base
 * We can at most create 50 records a second or 300 records a minute
 * If we exceed this rate, we will be put in a 30 second penalty box where
 * we can't do any further requests to the specific base
 * @param {String} apiKey - Airtable api key
 * @param {String} baseId - Airtable base id of the base we are adding
 *   records to
 * @param {String} tableName - Airtable base's table name that we will add to
 * @param {Object[]} records - Array of 1-10 records to add
 * @param {Object} [fieldValueMap=defaultMap] - Optional Object with records to
 *   field mapping see defaultMap in the top of this file (which is the default)
 *   object used if one isn't provided
 * @return {Promise<Array>} - Promise object that represents an array of records
 *                             created
 */
const addAirtableRows = (
    apiKey,
    baseId,
    tableName,
    records,
    fieldValueMap = config.fieldMap,
) => {
  // throw errors if records is not an array or if the array is empty or to big
  if (!(records instanceof Array)) throw Error('records must be an Array');
  if (records.length === 0 || records.length > 10) {
    throw new Error('Records must be of length 1-10');
  }
  // configure Airtable api
  Airtable.configure({
    apiKey: apiKey,
  });
  // get the base object
  const base = Airtable.base(baseId);
  // transform the array of records provided to airtable array of records in the
  // appropriate format - uses fieldValueMap to map
  const transformedRecords = transformObjects(records, fieldValueMap);
  // callback hell sucks, lets turn the callback into a native Promise
  const createRecords = util.promisify(base(tableName).create);
  // return the promise of the results of base(tablename).create
  return createRecords(transformedRecords);
};

module.exports = {addAirtableRows};
