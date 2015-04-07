'use strict';

var billModel = require('../model/bills.js'),

    err = null;

module.exports = function(app) {

  // route to add a bill.
  app.put('/bill', function(req, res) {
    billModel.add({
      bill: req.body.bill
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(201);
        res.send({
          bill: data
        });
      }
    });
  });

  // route to edit a bill.
  app.post('/bill/:id', function(req, res) {
    billModel.edit({
      id: req.params.id,
      bill: req.body.bill
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
          bill: data
        });
      }
    });
  });

  // route to get a bill.
  app.get('/bill/:id', function(req, res) {
    billModel.read({
      id: req.params.id
    },
    function(err, data) {
      if (err){
        err.send(res);
      }
      else{
        res.status(200);
        res.send({
          bill: data
        });
      }
    });
  });

  // route to delete a bill.
  app.delete('/bill/:id', function(req, res) {
    billModel.delete({
      id: req.params.id
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
          returned: data
        });
      }
    });
  });
};
