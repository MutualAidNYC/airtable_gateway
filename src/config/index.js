'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // load the local .env file
}

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

module.exports = config;
