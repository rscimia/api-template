'use strict';

var productModel = require('../model/products.js'),
    productController = {};

productController.create = {
  route: '/product',
  method: 'put',
  action: function(req, res) {
    productModel.add({
      product: req.body.product
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(201);
        res.send({
          product: data
        });
      }
    });
  }
};

productController.update = {
  route: '/product/:id',
  method: 'post',
  action: function(req, res) {
    productModel.edit({
      id: req.params.id,
      product: req.body.product
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
          product: data
        });
      }
    });
  }
};

productController.read = {
  route: '/product/:id',
  method: 'get',
  action: function(req, res) {
    productModel.read({
      id: req.params.id
    },
    function(err, data) {
      if (err){
        err.send(res);
      }
      else{
        res.status(200);
        res.send({
          product: data
        });
      }
    });
  }
};

productController.delete = {
  route: '/product/:id',
  method: 'delete',
  action: function(req, res) {
    productModel.delete({
      id: req.params.id
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
          product: data
        });
      }
    });
  }
};

module.exports = productController;
