'use strict';

var request = require('supertest'),
    assert = require('assert'),

    config = require('../config/config.json'),
    url = config.host + ':' + config.port;

describe('Bills tests', function() {

  describe('PUT:/bill', function() {

    it('should fail : invalid id', function(done) {
      request(url).put('/bill')
        .send({ bill: {
          seller: 'Computer Inc.',
          amount: 524.95
        }})
        .end(function(err, res) {
          assert.equal(res.status, 400)
          assert.equal(err, null);
          assert.deepEqual(res.body.error, 'Invalid bill ID.');

          done();
        });
    });

    it('should fail : invalid seller', function(done) {
      request(url).put('/bill')
        .send({ bill: {
          id: 'B01',
          amount: 524.95
        }})
        .end(function(err, res) {
          assert.equal(res.status, 400)
          assert.equal(err, null);
          assert.deepEqual(res.body.error, 'Invalid bill seller.');

          done();
        });
    });

    it('should fail : invalid amount', function(done) {
      request(url).put('/bill')
        .send({ bill: {
          id: 'B01',
          seller: 'Computer Inc.'
        }})
        .end(function(err, res) {
          assert.equal(res.status, 400)
          assert.equal(err, null);
          assert.deepEqual(res.body.error, 'Invalid bill amount.');

          done();
        });
    });

    it('should create new bill', function(done) {
      request(url).put('/bill')
        .send({ bill: {
          id: 'B01',
          seller: 'Computer Inc.',
          amount: 524.95
        }})
        .end(function(err, res) {
          assert.equal(res.status, 201)
          assert.equal(err, null);
          assert.deepEqual(
            res.body.bill,
            {
              id: 'B01',
              seller: 'Computer Inc.',
              amount: 524.95
            }
          );

          done();
        });
    });

  });

});
