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
          metaFieldName: 'Meta', // Defaults to `Meta`
          lastModifiedFieldName: 'AirTable Gateway Last Modified',
          lastProcessedFieldName: 'Airtable Gateway Last Processed',
        },
    );
  }
  async processChangedRecords(recordsChanged) {
    const numChanges = recordsChanged.length;
    const msg =
      `Found ${numChanges} changes in ${config.airtable.tableName}`;
    console.info(msg);
    const promises = [];
    recordsChanged.forEach((record) => {
      if (Object.keys(record.getMeta().lastValues).length === 0) return;
      let status;
      const justCantArr = [
        'In Progress - We Can’t Take Responsibility for This Anymore',
        'EMERGENCY- Has Urgent Needs to be filled; that we cannot!',
      ];
      const completedArr = [
        'Resolved - Follow up next week',
        'Resolved - Able to Fill Need',
        'Resolved - Cancelled',
      ];
      const assignedArr = [
        'In Progress- Unable to contact',
        'In Progress - We Take Responsibility For This',
      ];
      if (justCantArr.includes(record.fields.Status)) {
        status = 'justCant';
      } else if (completedArr.includes(record.fields.Status)) {
        status = 'completed';
      } else if (assignedArr.includes(record.fields.Status)) {
        status = 'assigned';
      } else {
        return;
      }
      promises.push(axios.post(config.url.newReq, {
        manyc: {
          status, // justCant || completed || assigned
          id: record.fields['Unique ID'],
          groupClaiming:
            record.fields['Group Claiming'] || null, // not always present
          notes: record.fields['Note'] || null, // not always present
        },
      }));
    });

    // If doing many Airtable writes, be careful of 5rps rate limit
    return Promise.all(promises);
  }
  poll() {
    this.airtableGatewayDetector.pollWithInterval(
        `Polling of ${config.airtable.tableName}`,
        10000, // interval in milliseconds
        this.processChangedRecords);
  }
}

const poller = new AirtablePoller();

module.exports = poller;

