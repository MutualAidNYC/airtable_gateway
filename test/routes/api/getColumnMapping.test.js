'use strict';
const request = require('supertest');
const {expect} = require('chai');
const expressLoader = require('../../../src/loaders/express');
const app = require('express')();

expressLoader(app);

describe('GET /api/getColumnMapping', async () => {
  it('return result 200 status', async () => {
    const res = await request(app).get('/api/getColumnMapping');

    expect(res.status).to.equal(200);
    expect(res.body).to.eql({});
    expect(res.type).to.equal('text/html');
    expect(res.text).to.include('Column Mapping not set yet ...');
  });
});
