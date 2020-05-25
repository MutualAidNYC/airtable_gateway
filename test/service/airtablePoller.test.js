'use strict';
const sinon = require('sinon');
const { expect } = require('chai');
const airtablePoller = require('../../src/service/airtablePoller');
const config = require('../../src/config');
const axios = require('axios');
const examples = require('./airtablePoller.examples');


describe('AirtablePoller', () => {
  describe('ChangeDetector dependancy', () => {
    it('Is initialiazed correctly', () => {
      expect(airtablePoller.airtableGatewayDetector.tableName).is
        .equal(config.airtable.tableName);
      expect(airtablePoller.airtableGatewayDetector.writeDelayMs).is.equal(100);
      expect(airtablePoller.airtableGatewayDetector.metaFieldName).is
        .equal('Meta');
      expect(airtablePoller.airtableGatewayDetector.lastModifiedFieldName).is
        .equal('AirTable Gateway Last Modified');
      expect(airtablePoller.airtableGatewayDetector.lastProcessedFieldName).is
        .equal('Airtable Gateway Last Processed');
    });
    describe('poll', () => {
      let stub;
      beforeEach(() => {
        stub = sinon.stub(
          airtablePoller.airtableGatewayDetector, 'pollWithInterval',
        );
      });
      afterEach(() => {
        stub.restore();
      });
      it('Starts airtable gateway detector polling', () => {
        airtablePoller.poll();
        expect(stub.calledOnce).to.be.true;
        expect(stub.firstCall.args[0]).to
          .equal(`Polling of ${config.airtable.tableName}`);
        expect(stub.firstCall.args[1]).to.equal(10000);
        expect(typeof stub.firstCall.args[2]).to.equal('function');
        expect(stub.firstCall.args[2].name).to.equal('processChangedRecords');
      });
    });
    describe('processChangedRecords', () => {
      let stub;
      before(() => {
        config.statusMap.justCantArr = [
          'In Progress - We Can’t Take Responsibility for This Anymore',
          'EMERGENCY - Has Urgent Needs to be filled; that we cannot!'
        ]
        config.statusMap.completedArr = [
          'Resolved - Follow up next week',
          'Resolved - Able to Fill Need',
          'Resolved - Cancelled'
        ]
        config.statusMap.assignedArr = [
          'In Progress - Unable to contact',
          'In Progress - We Take Responsibility For This'
        ]
      });
      beforeEach(() => {
        stub = sinon.stub(axios, 'post');
      });
      afterEach(() => {
        stub.restore();
      });
      it('Skips never before processed records', () => {
        examples.newRecord[0].getMeta = sinon.stub();
        examples.newRecord[0].getMeta.returns({ lastValues: [] });
        airtablePoller.processChangedRecords(examples.newRecord);
        expect(stub.notCalled).to.be.true;
      });
      it('Handles multiple records', () => {
        examples.twoRecords[0].getMeta = sinon.stub();
        examples.twoRecords[0].getMeta.returns({ lastValues: [1, 2] });
        examples.twoRecords[1].getMeta = sinon.stub();
        examples.twoRecords[1].getMeta.returns({ lastValues: [1, 2] });
        airtablePoller.processChangedRecords(examples.twoRecords);
        expect(stub.calledTwice).to.be.true;
      });
      // eslint-disable-next-line max-len
      describe(`Categorizes statuses and sends a 'Groups Update MANYC record'`, () => {
        const updateObj = {
          manyc: {
            status: undefined,
            id: 985,
            groupClaiming: null,
            notes: 'some awesome note',
          },
        };
        beforeEach(() => {
          examples.oneRecord[0].getMeta = sinon.stub().returns({
            lastValues: [1, 2],
          });
        });
        it('Skips new status', () => {
          examples.oneRecord[0].fields.Status = 'New';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.notCalled).to.be.true;
        });
        it('Skips unkown status', () => {
          examples.oneRecord[0].fields.Status = 'giberish';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.notCalled).to.be.true;
        });
        // eslint-disable-next-line max-len
        it('Handles status "In Progress - We Can’t Take Responsibility for This Anymore"', () => {
          updateObj.manyc.status = 'justCant';
          examples.oneRecord[0].fields.Status =
            'In Progress - We Can’t Take Responsibility for This Anymore';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
          expect(stub.firstCall.args[1]).to.eql(updateObj);
        });
        // eslint-disable-next-line max-len
        it('Handles status "EMERGENCY- Has Urgent Needs to be filled; that we cannot!"', () => {
          updateObj.manyc.status = 'justCant';
          examples.oneRecord[0].fields.Status =
            'EMERGENCY - Has Urgent Needs to be filled; that we cannot!';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
          expect(stub.firstCall.args[1]).to.eql(updateObj);
        });
        it('Handles status "Resolved - Follow up next week"', () => {
          updateObj.manyc.status = 'completed';
          examples.oneRecord[0].fields.Status =
            'Resolved - Follow up next week';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
          expect(stub.firstCall.args[1]).to.eql(updateObj);
        });
        it('Handles status "Resolved - Able to Fill Need"', () => {
          updateObj.manyc.status = 'completed';
          examples.oneRecord[0].fields.Status = 'Resolved - Able to Fill Need';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
          expect(stub.firstCall.args[1]).to.eql(updateObj);
        });
        it('Handles status "Resolved - Cancelled"', () => {
          updateObj.manyc.status = 'completed';
          examples.oneRecord[0].fields.Status = 'Resolved - Cancelled';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
          expect(stub.firstCall.args[1]).to.eql(updateObj);
        });
        it('Handles status "In Progress- Unable to contact"', () => {
          updateObj.manyc.status = 'assigned';
          examples.oneRecord[0].fields.Status =
            'In Progress - Unable to contact';
          airtablePoller.processChangedRecords(examples.oneRecord);
          expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
          expect(stub.firstCall.args[1]).to.eql(updateObj);
        });
        it('Handles status "In Progress - We Take Responsibility For This"',
          () => {
            updateObj.manyc.status = 'assigned';
            examples.oneRecord[0].fields.Status =
              'In Progress - We Take Responsibility For This';
            airtablePoller.processChangedRecords(examples.oneRecord);
            expect(stub.firstCall.args[0]).to.equal(config.url.newReq);
            expect(stub.firstCall.args[1]).to.eql(updateObj);
          });
      });
    });
  });
});
