'use strict';
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');
const expressLoader = require('../../../src/loaders/express');
const app = require('express')();
// eslint-disable-next-line max-len
const recallNeedsRequestObj = require('../../../src/service/recallNeedsRequest');

expressLoader(app);

describe.only('POST /api/deleteRequest', async () => {
  let stub;
  const deleteObj = {
    manyc: {
      status: 'delete',
      id: 'ABC123',
    },
  };
  beforeEach(() => {
    stub = sinon.stub(recallNeedsRequestObj, 'recallNeedsRequest');
  });
  afterEach(() => {
    stub.restore();
  });
  it('Destroys the specified record', async () => {
    stub.resolves('');
    const res = await request(app).post('/api/deleteRequest')
        .send(deleteObj);
    // console.log('stub: %o', stub);
    expect(stub.firstCall.firstArg).to.equal(deleteObj.manyc.id);
    expect(res.status).to.equal(200);
    expect(res.body).to.eql({});
    expect(res.type).to.equal('text/html');
    expect(res.text).to.equal('Request deleted');
  });
  it('Fails silently', async () => {
    stub.throws('error');
    const res = await request(app).post('/api/deleteRequest')
        .send(deleteObj);

    expect(stub.firstCall.firstArg).to.equal(deleteObj.manyc.id);
    expect(res.status).to.equal(200);
    expect(res.body).to.eql({});
    expect(res.type).to.equal('text/html');
    expect(res.text).to.equal('Request deleted');
  });
});
