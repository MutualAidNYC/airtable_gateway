'use strict';
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');
const expressLoader = require('../../../src/loaders/express');
const app = require('express')();
const addAirtableToRow = require('../../../src/service/addAirTableRow');
const config = require('../../../src/config');

expressLoader(app);

describe('GET /api/createRequest', async () => {
  let stub;
  beforeEach(() => {
    stub = sinon.stub(addAirtableToRow, 'addAirtableRows');
  });
  afterEach(() => {
    stub.restore();
  });
  it('return result 200 status with a descriptive message', async () => {
    stub.resolves('');
    const res = await request(app).post('/api/createRequest');

    expect(res.status).to.equal(200);
    expect(res.body).to.eql({});
    expect(res.type).to.equal('text/html');
    expect(res.text).to.equal('MANYC Airtable-Gateway Needs Request Created');
  });
  it('Invokes addAirtableRows', async () => {
    const fakeBody = {use: 'me'};
    stub.resolves('');

    await request(app).post('/api/createRequest').send(fakeBody);

    expect(stub.called).to.be.true;
    expect(stub.firstCall.args[0]).to.equal(config.airtable.key);
    expect(stub.firstCall.args[1]).to.equal(config.airtable.baseId);
    expect(stub.firstCall.args[2]).to.equal(config.airtable.tableName);
    expect(stub.firstCall.args[3]).to.eql([fakeBody]);
  });
  it('Doesn\'t crash the program on an error', async () => {
    stub.throws(new Error('fake error yo!'));
    await request(app).post('/api/createRequest');
  });
});
