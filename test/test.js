'use strict';

var request = require('supertest'),
    assert = require('assert'),

    server = require('../server.js'),
    model = require('../model/model.js'),
    config = server.settings(),

    // copy config to restore after tests.
    initialConfig = Object.keys(config).reduce(function(c, k) {
      c[k] = config[k];
      return c;
    }, {}),

    newConfig = {
      host: 'localhost',
      port: 3001,
      preventException: false,
      dataFile: "model/test.json"
    },
    url = initialConfig.host + ':' + initialConfig.port;

describe('Model tests', function() {
  it('should have loaded data from test/data.json', function(done) {
    assert.deepEqual(model.get('bills'), [{
          id: 'alreadyThereBill',
          seller: 'test seller',
          amount: 50
    }]);
    done();
  });
});

describe('Server tests', function() {
  describe('server.settings', function() {

    it('should return configuration', function() {
      assert.deepEqual(server.settings(), initialConfig);
    });

    it('should return configurated port', function() {
      assert.deepEqual(server.settings('port'), initialConfig.port);
    });

    it('should set a new port', function() {
      assert.deepEqual(
        server.settings('port', newConfig.port).settings('port'),
        newConfig.port
        );
    });

    it('should set a new configuration', function() {
      assert.deepEqual(
        server.settings(newConfig).settings(),
        newConfig
        );
    });

    // restore initial settings
    after(function() {
      server.settings(initialConfig);
    })
  });
});

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

  describe('GET:/bill/id',function(){
    it('should fail : invalid id', function(done) {
          request(url).get('/bill/B02')
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 404)
              assert.equal(err, null);
              assert.deepEqual(res.body.error, 'Bill not found.');
              done();
            });
        });
    it('should return a bill', function(done) {
          request(url).get('/bill/B01')
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 200)
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

  describe('POST:/bill/id',function(){
    it('should return a modified bill', function(done) {
          request(url).post('/bill/B01')
            .send({ bill: {
                  id: 'B01',
                  seller: 'Computer Inc.',
                  amount: 600.50
                }})
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(err, null);
              assert.deepEqual(
              res.body.bill,
                {
                  id: 'B01',
                  seller: 'Computer Inc.',
                  amount: 600.50
                }
              );
              done();
            });
        });
     it('should fail : invalid id', function(done) {
          request(url).post('/bill/B02')
            .send({ bill: {
                  id: 'B01',
                  seller: 'Computer Inc.',
                  amount: 600.50
                }})
            .end(function(err, res) {
              assert.equal(res.status, 404)
              assert.equal(err, null);
              assert.deepEqual(res.body.error, 'Bill not found.');
              done();
            });
        });
  });

describe('DELETE:/bill/id',function(){
    it('should return a deleted bill', function(done) {
          request(url).delete('/bill/B01')
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(err, null);
              assert.deepEqual(
              res.body.bill,
                {
                  id: 'B01',
                  seller: 'Computer Inc.',
                  amount: 600.50
                }
              );
              done();
            });
        });
});

});

describe('Products tests', function() {
  describe('PUT:/product', function() {

    it('should fail : invalid id', function(done) {
      request(url).put('/product')
        .send({ product: {
          quantity: 2 ,
          price: 30.5
        }})
        .end(function(err, res) {
          assert.equal(res.status, 400)
          assert.equal(err, null);
          assert.deepEqual(res.body.error, 'Invalid product ID.');

          done();
        });
    });

    it('should fail : invalid quantity', function(done) {
      request(url).put('/product')
        .send({ product: {
          id: 'P01',
          price: 30.5
        }})
        .end(function(err, res) {
          assert.equal(res.status, 400)
          assert.equal(err, null);
          assert.deepEqual(res.body.error, 'Invalid product quantity.');

          done();
        });
    });

    it('should fail : invalid price', function(done) {
      request(url).put('/product')
        .send({ product: {
          id: 'P01',
          quantity: 2
        }})
        .end(function(err, res) {
          assert.equal(res.status, 400)
          assert.equal(err, null);
          assert.deepEqual(res.body.error, 'Invalid product price.');

          done();
        });
    });

    it('should create new product', function(done) {
      request(url).put('/product')
        .send({ product: {
          id: 'P01',
          quantity: 2,
          price: 30.5
        }})
        .end(function(err, res) {
          assert.equal(res.status, 201)
          assert.equal(err, null);
          assert.deepEqual(
            res.body.product,
            {
              id: 'P01',
              quantity: 2,
              price: 30.5
            }
          );

          done();
        });
    });

  });

  describe('GET:/product/id',function(){
    it('should fail : invalid id', function(done) {
          request(url).get('/product/P02')
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 404)
              assert.equal(err, null);
              assert.deepEqual(res.body.error, 'product not found.');
              done();
            });
        });
    it('should return a product', function(done) {
          request(url).get('/product/P01')
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(err, null);
               assert.deepEqual(
              res.body.product,
              {
                id: 'P01',
                quantity: 2,
                price: 30.5
              }
            );
              done();
            });
        });
  });

  describe('POST:/product/id',function(){
    it('should return a modified product', function(done) {
          request(url).post('/product/P01')
            .send({ product: {
                  id: 'P01',
                  quantity: 5,
                  price: 30.5
                }})
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(err, null);
              assert.deepEqual(
              res.body.product,
                {
                  id: 'P01',
                  quantity: 5,
                  price: 30.5
                }
              );
              done();
            });
        });
     it('should fail : invalid id', function(done) {
          request(url).post('/product/P02')
            .send({ product: {
                id: 'P01',
                quantity: 5,
                price: 30.5
                }})
            .end(function(err, res) {
              assert.equal(res.status, 404)
              assert.equal(err, null);
              assert.deepEqual(res.body.error, 'product not found.');
              done();
            });
        });
  });

describe('DELETE:/product/id',function(){
    it('should return a deleted product', function(done) {
          request(url).delete('/product/P01')
            .send()
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(err, null);
              assert.deepEqual(
              res.body.product,
                {
                  id: 'P01',
                  quantity: 5,
                  price: 30.5
                }
              );
              done();
            });
        });
});

});
