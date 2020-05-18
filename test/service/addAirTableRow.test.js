'use strict';
const sinon = require('sinon');
const {expect} = require('chai');
const {addAirtableRows} = require('../../src/service/addAirTableRow');
const Airtable = require('airtable');
const config = require('../../src/config');


describe('addAirtableRows', () => {
  let baseStub; let createStub; let configureStub; let selectedBaseStub;

  const input = [{
    manyc: {
      status: 1,
      id: 2,
      supportType: 3,
      otherSupport: 4,
      community: 5,
      language: 6,
      languageOther: 7,
      phone: 8,
      email: 9,
      fullName: 10,
      urgency: 11,
      contactMethod: 12,
      crossStreet: 13,
      timestampSent: 14,
    },
  }, {
    manyc: {
      status: 15,
      id: 16,
      supportType: 17,
      otherSupport: 18,
      community: 19,
      language: 20,
      languageOther: 21,
      phone: 22,
      email: 23,
      fullName: 24,
      urgency: 25,
      contactMethod: 26,
      crossStreet: 27,
      timestampSent: 28,
    },
  }];

  const result1 = [{
    fields: {
      'Status': 1,
      'Unique ID': 2,
      'What type(s) of support are you seeking?': 3,
      'If you\'re seeking other types of support, please describe.': 4,
      'Are you, or anyone in your household in one or more of these hardest-hit groups? Please select all that apply.': 5, // eslint-disable-line max-len
      'Language Access: is your primary language something other than English, for which you\'d need translation & interpretation support to connect to volunteers?': 6, // eslint-disable-line max-len
      'Other language(s) spoken:': 7,
      'Cell': 8,
      'Email': 9,
      'Full Name': 10,
      'How soon do you need support?': 11,
      'Which of these ways are best to get in touch with you?': 12,
      'Cross Streets': 13,
      'Dispatched Time': 14,
    },
  },
  {
    fields: {
      'Status': 15,
      'Unique ID': 16,
      'What type(s) of support are you seeking?': 17,
      'If you\'re seeking other types of support, please describe.': 18,
      'Are you, or anyone in your household in one or more of these hardest-hit groups? Please select all that apply.': 19, // eslint-disable-line max-len
      'Language Access: is your primary language something other than English, for which you\'d need translation & interpretation support to connect to volunteers?': 20, // eslint-disable-line max-len
      'Other language(s) spoken:': 21,
      'Cell': 22,
      'Email': 23,
      'Full Name': 24,
      'How soon do you need support?': 25,
      'Which of these ways are best to get in touch with you?': 26,
      'Cross Streets': 27,
      'Dispatched Time': 28,
    },
  },
  ];
  const mapping = {
    status: '1',
    id: '2',
    supportType: '3',
    otherSupport: '4',
    community: '5',
    language: '6',
    languageOther: '7',
    phone: '8',
    email: '9',
    fullName: '10',
    urgency: '11',
    contactMethod: '12',
    crossStreet: '13',
    timestampSent: '14',
  };

  const result2 = [{
    fields: {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      '11': 11,
      '12': 12,
      '13': 13,
      '14': 14,
    },
  },
  {
    fields: {
      '1': 15,
      '2': 16,
      '3': 17,
      '4': 18,
      '5': 19,
      '6': 20,
      '7': 21,
      '8': 22,
      '9': 23,
      '10': 24,
      '11': 25,
      '12': 26,
      '13': 27,
      '14': 28,
    },
  },
  ];
  beforeEach(() => {
    createStub = sinon.stub();
    baseStub = sinon.stub(Airtable, 'base');
    // createStub.resolves(recordId);
    createStub.callsArgWith(1, undefined, undefined);
    selectedBaseStub = sinon.stub();
    configureStub = sinon.stub(Airtable, 'configure');
    baseStub.returns(selectedBaseStub);
    selectedBaseStub.returns({create: createStub});
  });
  afterEach(() => {
    configureStub.restore();
    baseStub.restore();
  });
  // eslint-disable-next-line max-len
  describe('Transforms records and adds to Airtable base and returns a promise', () => {
    it('Uses a default mapping', () => {
      expect(addAirtableRows(
          config.airtable.key,
          config.airtable.baseId,
          config.airtable.tableName,
          input,
      )).to.be.instanceOf(Promise);
      expect(baseStub.firstCall.firstArg).to.equal(config.airtable.baseId);
      expect(selectedBaseStub.firstCall.firstArg).to.equal(config.airtable
          .tableName);
      expect(configureStub.firstCall.firstArg).to.eql({
        apiKey: config.airtable
            .key,
      });
      expect(createStub.firstCall.args[0]).to.eql(result1);
      expect(typeof createStub.firstCall.args[1]).to.equal('function');
    });
    it('Can override the default mapping', () => {
      expect(addAirtableRows(
          config.airtable.key,
          config.airtable.baseId,
          config.airtable.tableName,
          input,
          mapping,
      )).to.be.instanceOf(Promise);
      expect(baseStub.firstCall.firstArg).to.equal(config.airtable.baseId);
      expect(selectedBaseStub.firstCall.firstArg).to.equal(config.airtable
          .tableName);
      expect(configureStub.firstCall.firstArg).to.eql({
        apiKey: config.airtable
            .key,
      });
      expect(createStub.firstCall.args[0]).to.eql(result2);
      expect(typeof createStub.firstCall.args[1]).to.equal('function');
    });
  });
});
