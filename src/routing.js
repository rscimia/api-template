'use strict';

var billModel = require('../model/bills.js'),

    err = null;

module.exports = function(app) {

  // route to add a bill.
  app.put('/bill', function(req, res) {
    var bill = req.body.bill,
        result = billModel.add(bill);

    if (typeof result.send === 'function')
      result.send(res);
    else {
      res.status(201);
      res.send({
        bill: result
      });
    }
  });

  // route to edit a bill.
  app.post('/bill/:id', function(req, res) {
    var bill = req.body.bill,
        id = req.params.id,
        result = billModel.edit(id, bill);

    if (typeof result.send === 'function')
      result.send(res);
    else {
      res.status(200);
      res.send({
        bill: result
      });
    }
  });

  // route to get a bill.
  app.get('/bill/:id', function(req, res) {
    var id = req.params.id,
        result = billModel.read(id);

    if (typeof result.send === 'function')
      result.send(res);
    else {
      res.status(200);
      res.send({
        bill: result
      });
    }
  });

  // route to delete a bill.
  app.delete('/bill/:id', function(req, res) {
    var id = req.params.id,
        result = billModel.delete(id);

    if (typeof result.send === 'function')
      result.send(res);
    else {
      res.status(200);
      res.send({
        returned: result
      });
    }
  });
};
