'use strict';
const axios = require('axios');
const Airtable = require('airtable');
const ChangeDetector = require('airtable-change-detector');
const config = require('../config');

class AirtablePoller {
  constructor() {
    const base = new Airtable({apiKey: config.airtable.key})
        .base(config.airtable.baseId);

    this.airtableGatewayDetector = new ChangeDetector(
        base(config.airtable.tableName), {
          writeDelayMs: 100,
          metaFieldName: config.airtableChangeDetectorFields.meta,
          lastModifiedFieldName: config.airtableChangeDetectorFields.lastModifiedFieldName, // eslint-disable-line max-len
          lastProcessedFieldName: config.airtableChangeDetectorFields.lastProcessedFieldName, // eslint-disable-line max-len
        },
    );
  }

  async processChangedRecords(recordsChanged) {
    const numChanges = recordsChanged.length;
    console.info(`Found ${numChanges} changes in ${config.airtable.tableName}`);
    const promises = [];
    recordsChanged.forEach((record) => {
      if (Object.keys(record.getMeta().lastValues).length === 0) return;

      let status;
      const recordStatus = records.fields[config.fieldMap.status];
      if (config.statusMap.justCantArr.includes(recordStatus)) {
        status = 'justCant';
      } else if (config.statusMap.completedArr.includes(recordStatus)) {
        status = 'completed';
      } else if (config.statusMap.assignedArr.includes(recordStatus)) {
        status = 'assigned';
      } else {
        console.log('No Correlated Status Mapping, Ignoring Change...');
        return;
      }

      let manycId;
      if (record.fields[config.fieldMap.id]) {
        manycId = record.fields[config.fieldMap.id];
      } else {
        console.log('No Correlated ID Mapping, Ignoring Change...');
        return;
      }

      promises.push(axios.post(config.url.newReq, {
        manyc: {
          status: status, // required
          id: manycId, // required
          groupClaiming: record.fields['Groups Claiming'] || null, // optional
          notes: record.fields['Notes'] || null, // optional
        },
      }));
    });

    // If doing many Airtable writes, be careful of 5rps rate limit
    Promise.all(promises);
    if (numChanges > 0) {
      console.log(
          `Successfully Sent ${numChanges} New/Updated Request(s) to MANYC`,
      );
    }
    return;
  }

  poll() {
    this.airtableGatewayDetector.pollWithInterval(
        `Polling of ${config.airtable.tableName}`,
        10000, // interval in milliseconds
        this.processChangedRecords,
    );
  }

  async pollOnce() {
    const changedRecords = await this.airtableGatewayDetector.pollOnce();
    this.processChangedRecords(changedRecords);
  }
}

const poller = new AirtablePoller();

module.exports = poller;
