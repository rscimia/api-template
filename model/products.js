'use strict';

var model = require('./model.js'),
    cursor = model.select('products'),
    error = require('../utils/error.js'),
    callbacks = [];

/**
 * As Baobab update data asynchronously, this model have to be asynchronous.
 * This way, add, edit, read and delete methods take two parameters :
 * - data : the data used to update the tree.
 * - cb : a callback function that take an error and updated data.
 *
 * As baobab does not have any callback on edition methods, there is a callback
 * queue in `callbacks` containing each callbacks to be executed on the next
 * cursor update. On the cursor update event, each function from the queue is
 * executed.
 */

/**
 * Execute callbacks from the `callbacks` function queue.
 */
cursor.on('update', function() {
  while (callbacks.length) {
    var cb = callbacks.shift();
    cb();
  }
});


module.exports = {
  cursor: cursor,
  /**
   * Check for formating error in product object
   * @param  {Object}       product a product object
   * @return {Oject|false}       the formating error object or false if no one.
   */
  formatError: function(product) {
    if (product === undefined)
      return error(400, 'Missing product.');

    if (typeof product.id !== 'string')
      return error(400, 'Invalid product ID.');

    if (typeof product.quantity !== 'number')
      return error(400, 'Invalid product quantity.');

    if (typeof product.price !== 'float')
      return error(400, 'Invalid product price.');

    return false;
  },

  /**
   * Add product to the model
   * @param {Object}   data An object within a product object on key `product`
   * @param {Function} cb   A callback function to be executed after insertion.
   */
  add: function(data, cb) {
    var err = false;

    if (err = this.formatError(data.product))
      cb(err, null);
    else {
      cursor.push(data.product);
      callbacks.push(function() {
        cb(null, data.product);
      });
    }
  },

  /**
   * Edit an existing product in the model
   * @param  {Object}   data An object within a product object on key `product`
   *                         and a product id on key `id`
   * @param  {Function} cb   A callback function to be executed after edition.
   */
  edit: function(data, cb) {
    var err = false;

    // check product format
    if (err = this.formatError(data.product))
      cb(err, null);
    else {
      // look for existancy
      var productCursor = cursor.select({id: data.id});
      if (!productCursor.get())
        cb(error(404, 'product not found.'), null);
      else {
        // prevent id changing
        data.product.id = data.id;

        // updating data
        productCursor.edit(data.product);

        callbacks.push(function() {
          cb(null, data.product);
        });
      }
    }
  },

  /**
   * Read a product from the model
   * @param  {Object}   data An object within a product id on key `id`
   * @param  {Function} cb   A callback function to be executed after reading.
   */
  read: function(data, cb) {
    var productCursor = cursor.select({id: data.id});
    if (!productCursor.get())
      cb(error(404, 'product not found.'), null);
    else
      cb(null, productCursor.get());
  },

  /**
   * Delete a product from the model
   * @param  {Object}   data An object within a product id on key `id`
   * @param  {Function} cb   A callback function to be executed after deletion.
   */
  delete: function(data, cb) {
    var productCursor = cursor.select({id: data.id}),
        product = productCursor.get();

    if (!product)
      cb(error(404, 'product not found.'), null);
    else {
      productCursor.remove();
      callbacks.push(function() {
        cb(null, product);
      });
    }
  }
};

