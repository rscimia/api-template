'use strict';

var billModel = require('../model/bills.js'),
    billController = {};

billController.create = {
  route: '/bill',
  method: 'put',
  action: function(req, res) {
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
  }
};

billController.update = {
  route: '/bill/:id',
  method: 'post',
  action: function(req, res) {
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
  }
};

billController.read = {
  route: '/bill/:id',
  method: 'get',
  action: function(req, res) {
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
  }
};

billController.delete = {
  route: '/bill/:id',
  method: 'delete',
  action: function(req, res) {
    billModel.delete({
      id: req.params.id
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
  }
};

module.exports = billController;
