'use strict';
const sinon = require('sinon');
const {expect} = require('chai');
const {recallNeedsRequest} = require('../../src/service/recallNeedsRequest');
const updateAirtableRowObj = require('../../src/service/updateAirtableRow');
const config = require('../../src/config');

describe('recallNeedsRequest', () => {
  let stub;
  const recordId = 'abcRec';
  beforeEach(() => {
    stub = sinon.stub(updateAirtableRowObj, 'updateAirtableRow');
  });
  afterEach(() => {
    stub.restore();
  });
  describe('Recalls a record given a MANYC record id', () => {
    it('Recalls the record', async () => {
      recallNeedsRequest(recordId);
      expect(stub.firstCall.args[0]).to.equal(config.airtable.key);
      expect(stub.firstCall.args[1]).to.equal(config.airtable.baseId);
      expect(stub.firstCall.args[2]).to.equal(config.airtable.tableName);
      expect(stub.firstCall.args[3]).to.eql({status: 'Recalled'});
      expect(stub.firstCall.args[4]).to.equal(recordId);
    });
    // eslint-disable-next-line max-len
    it('Raises an error if there is a problem updating', (done) => {
      stub.rejects('fake error yo');
      recallNeedsRequest(recordId).then(() => {
        done('bad');
      }).catch((e) => {
        done(); // good
      });
    });
  });
});
