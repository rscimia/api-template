'use strict';

var sellerModel = require('../model/sellers.js'),
    sellerController = {};

sellerController.create = {
  route: '/seller',
  method: 'put',
  action: function(req, res) {
    sellerModel.add({
      seller: req.body.seller
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(201);
        res.send({
          seller: data
        });
      }
    });
  }
};

sellerController.update = {
  route: '/seller/:id',
  method: 'post',
  action: function(req, res) {
    sellerModel.edit({
      id: req.params.id,
      seller: req.body.seller
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
          seller: data
        });
      }
    });
  }
};

sellerController.read = {
  route: '/seller/:id',
  method: 'get',
  action: function(req, res) {
    sellerModel.read({
      id: req.params.id
    },
    function(err, data) {
      if (err){
        err.send(res);
      }
      else{
        res.status(200);
        res.send({
          seller: data
        });
      }
    });
  }
};

sellerController.delete = {
  route: '/seller/:id',
  method: 'delete',
  action: function(req, res) {
    sellerModel.delete({
      id: req.params.id
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
          seller: data
        });
      }
    });
  }
};

module.exports = sellerController;
