'use strict';

var billModel = require('../model/bills.js'),

    err = null;

module.exports = function(app) {

  // route to add a bill.
  app.put('/bill', function(req, res) {
    var bill = req.body.bill;

    if (!(err = billModel.formatError(bill))) {
      billModel.data.push(bill);
      res.status(201);
      res.send({
        bill: bill
      });
    }
    else {
      res.status(400);
      res.send({
        error: err
      });
    }
  });

  // route to edit a bill.
  app.post('/bill/:id', function(req, res) {
    if (!(err = billModel.formatError(req.body.bill))) {
      var bill = billModel.data.get({id: req.params.id});

      if (!bill) {
        res.status(404);
        res.send({
          error: 'Bill not found.'
        });
      }
      billModel.data.select({id: req.params.id}).edit(req.body.bill);
      res.status(200);
      res.send({
        bill: bill
      });
    }
    else {
      res.status(400);
      res.send({
        error: err
      });
    }
  });

  // route to get a bill.
  app.get('/bill/:id', function(req, res) {
    var bill = billModel.data.get({id: req.params.id});

    if (bill)
      res.send({
        bill: bill
      });
    else {
      res.status(404);
      res.send({
        error: 'Bill not found.'
      });
    }
  });
};
