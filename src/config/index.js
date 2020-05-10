'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // load the local .env file
}

const deepFreeze = (object) => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);
  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
};

const config = {
  airtable: {
    key: process.env.AIRTABLE_KEY,
    baseId: process.env.AIRTABLE_BASE,
    tableName: process.env.AIRTABLE_TABLE_NAME,
  },
  url: {
    newReq: process.env.MANYC_NEW_REQ,
    updateReq: process.env.MANYC_UPDATE_REQ,
    deleteReq: process.env.MANYC_DELETE_REQ_URL,
  },
  port: process.env.PORT,
};

// config values should never ever be mutated, lets make sure!
module.exports = deepFreeze(config);
