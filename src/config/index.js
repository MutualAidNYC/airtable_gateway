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
    newReq: process.env.MANYC_NEW_REQ_URL,
    updateReq: process.env.MANYC_UPDATE_REQ_URL,
    deleteReq: process.env.MANYC_DELETE_REQ_URL,
  },
  fieldMap: {
    status: process.env.FIELD_MAP_STATUS,
    id: process.env.FIELD_MAP_ID,
    supportType: process.env.FIELD_MAP_SUPPORT_TYPE,
    otherSupport: process.env.FIELD_MAP_OTHER_SUPPORT,
    community: process.env.FIELD_MAP_COMMUNITY,
    language: process.env.FIELD_MAP_LANGUAGE,
    languageOther: process.env.FIELD_MAP_LANGUAGE_OTHER,
    phone: process.env.FIELD_MAP_PHONE,
    email: process.env.FIELD_MAP_EMAIL,
    fullName: process.env.FIELD_MAP_FULL_NAME,
    urgency: process.env.FIELD_MAP_URGENCY,
    contactMethod: process.env.FIELD_MAP_CONTACT_METHOD,
    crossStreet: process.env.FIELD_MAP_CROSS_STREET,
    timestampCreated: process.env.FIELD_MAP_TIME_STAMP_CREATED,
    timestampSent: process.env.FIELD_MAP_TIME_STAMP_SENT,
    source: process.env.FIELD_MAP_SOURCE,
    sourceID: process.env.FIELD_MAP_SOURCE_ID,
  },
  statusMap: {
    justCantArr: [],
    completedArr: [],
    assignedArr: [],
  },
  airtableChangeDetectorFields: {
    meta: process.env.POLL_FIELD_META,
    lastModifiedFieldName: process.env.POLL_FIELD_LAST_MODIFIED,
    lastProcessedFieldName: process.env.POLL_FIELD_LAST_PROCESSED,
  },
  port: process.env.PORT,
  isFreeHerokuDyno: process.env.FREE_HEROKU_DYNO === 'true' ? true : false,
};

// lets get up to 10 statuses for the status mapping
for (let idx = 0; idx < 10; idx++) {
  const justCantVar = `STATUS_MAP_JUST_CANT_${idx}`;
  if (process.env[justCantVar]) {
    config.statusMap.justCantArr.push(process.env[justCantVar]);
  }
  const completedVar = `STATUS_MAP_COMPLETED_${idx}`;
  if (process.env[completedVar]) {
    config.statusMap.completedArr.push(process.env[completedVar]);
  }
  const assignedVar = `STATUS_MAP_ASSIGNED_${idx}`;
  if (process.env[assignedVar]) {
    config.statusMap.assignedArr.push(process.env[assignedVar]);
  }
}

module.exports = config;