'use strict';
const sinon = require('sinon');
const {expect} = require('chai');
const {recallNeedsRequest} = require('../../src/service/recallNeedsRequest');
const Airtable = require('airtable');
const config = require('../../src/config');

describe('recallNeedsRequest', () => {
  let baseStub; let selectStub; let configureStub; let selectedBaseStub;
  let firstPageStub; let updateStub;
  const recordId = 'recXXXXXXXX';
  const oneRecords = [{getId: () => recordId}];
  const multipleRecords = [{}, {}];
  const updateObj = {
    id: recordId,
    fields: {},
  };
  before(() => {
    config.fieldMap.status = 'Status';
    config.fieldMap.id = 'Unique ID';
    config.fieldMap.supportType = 'What type(s) of support are you seeking?';
    config.fieldMap.otherSupport = `If you're seeking other types of support, please describe.`; // eslint-disable-line max-len
    config.fieldMap.community = 'Are you, or anyone in your household in one or more of these hardest-hit groups? Please select all that apply.'; // eslint-disable-line max-len
    config.fieldMap.language = `Language Access: is your primary language something other than English, for which you'd need translation & interpretation support to connect to volunteers?`; // eslint-disable-line max-len
    config.fieldMap.languageOther = 'Other language(s) spoken:';
    config.fieldMap.phone = 'Cell';
    config.fieldMap.email = 'Email';
    config.fieldMap.fullName = 'Full Name';
    config.fieldMap.urgency = 'How soon do you need support?';
    config.fieldMap.contactMethod = 'Which of these ways are best to get in touch with you?'; // eslint-disable-line max-len
    config.fieldMap.crossStreet = 'Cross Streets';
    config.fieldMap.timestampCreated = 'timeStampCreated';
    config.fieldMap.timestampSent = 'Dispatched Time';
    config.fieldMap.source = 'source';
    config.fieldMap.sourceID = 'sourceID';
    updateObj.fields[config.fieldMap.status] = 'Recalled';
  });
  beforeEach(() => {
    selectStub = sinon.stub();
    firstPageStub = sinon.stub();
    updateStub = sinon.stub();
    baseStub = sinon.stub(Airtable, 'base');
    selectedBaseStub = sinon.stub();
    configureStub = sinon.stub(Airtable, 'configure');
    baseStub.returns(selectedBaseStub);
    selectedBaseStub.returns({select: selectStub, update: updateStub});
    selectStub.returns({firstPage: firstPageStub});
  });
  afterEach(() => {
    configureStub.restore();
    baseStub.restore();
  });
  describe('Recalls a record given a MANYC record id', () => {
    it('Recalls the record', async () => {
      firstPageStub.callsArgWith(0, undefined, oneRecords);
      updateStub.callsArgWith(1, undefined, oneRecords);
      const result = recallNeedsRequest(1);
      expect(result).to.be.instanceOf(Promise);
      await result;
      expect(configureStub.firstCall.firstArg).to.eql({
        apiKey: config.airtable
            .key,
      });
      expect(baseStub.firstCall.firstArg).to.equal(config.airtable.baseId);
      expect(selectedBaseStub.firstCall.firstArg).to.equal(config.airtable
          .tableName);
      expect(selectStub.firstCall.firstArg)
          .to.eql({filterByFormula: `${config.fieldMap.id} = "1"`});
      expect(updateStub.firstCall.firstArg).to.eql([updateObj]);
    });
    // eslint-disable-next-line max-len
    it('Raises an error if there is not exactly one record with MANYC id', (done) => {
      firstPageStub.callsArgWith(0, undefined, multipleRecords);
      recallNeedsRequest(1).then(() => {
        done('bad');
      }).catch((e) => {
        done(); // good
      });
      expect(baseStub.firstCall.firstArg).to.equal(config.airtable.baseId);
      expect(selectedBaseStub.firstCall.firstArg).to.equal(config.airtable
          .tableName);
      expect(configureStub.firstCall.firstArg).to.eql({
        apiKey: config.airtable
            .key,
      });
      expect(selectStub.firstCall.firstArg)
          .to.eql({filterByFormula: `${config.fieldMap.id} = "1"`});
    });
  });
});
