'use strict';

var model = require('./model.js'),
    cursor = model.select('sellers'),
    error = require('../utils/error.js'),
    uuid = require('node-uuid'),
    callbacks = [];

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
   * Check for formating error in seller object
   * @param  {Object}       seller a seller object
   * @return {Oject|false}       the formating error object or false if no one.
   */
  formatError: function(seller) {
    if (seller === undefined)
      return error(400, 'Missing seller.');

    if (typeof seller.id !== 'string')
      return error(400, 'Invalid seller id.');

    if (typeof seller.name !== 'string')
      return error(400, 'Invalid seller name.');

    if (typeof seller.adress !== 'string')
      return error(400, 'Invalid seller adress.');

    if (typeof seller.mail !== 'string')
      return error(400, 'Invalid seller email.');

    if (typeof seller.phone !== 'number')
      return error(400, 'Invalid seller number phone.');
    return false;
  },

  /**
   * Add seller to the model
   * @param {Object}   data An object within a seller object on key `seller`
   * @param {Function} cb   A callback function to be executed after insertion.
   */
  add: function(data, cb) {
    var err = false;

    data.seller.id = uuid.v1();

    if (err = this.formatError(data.seller))
      cb(err, null);
    else {
      cursor.push(data.seller);
      callbacks.push(function() {
        cb(null, data.seller);
      });
    }
  },

  /**
   * Edit an existing seller in the model
   * @param  {Object}   data An object within a seller object on key `seller`
   *                         and a seller id on key `id`
   * @param  {Function} cb   A callback function to be executed after edition.
   */
  edit: function(data, cb) {
    var err = false;

    // check seller format
    if (err = this.formatError(data.seller))
      cb(err, null);
    else {
      // look for existancy
      var sellerCursor = cursor.select({id: data.id});
      if (!sellerCursor.get())
        cb(error(404, 'Seller not found.'), null);
      else {
        // prevent id changing
        data.seller.id = data.id;

        // updating data
        sellerCursor.edit(data.seller);

        callbacks.push(function() {
          cb(null, data.seller);
        });
      }
    }
  },

  /**
   * Read a seller from the model
   * @param  {Object}   data An object within a seller id on key `id`
   * @param  {Function} cb   A callback function to be executed after reading.
   */
  read: function(data, cb) {
    var sellerCursor = cursor.select({id: data.id});
    if (!sellerCursor.get())
      cb(error(404, 'Seller not found.'), null);
    else
      cb(null, sellerCursor.get());
  },

  /**
   * Delete a seller from the model
   * @param  {Object}   data An object within a seller id on key `id`
   * @param  {Function} cb   A callback function to be executed after deletion.
   */
  delete: function(data, cb) {
    var sellerCursor = cursor.select({id: data.id}),
        seller = sellerCursor.get();

    if (!seller)
      cb(error(404, 'Seller not found.'), null);
    else {
      sellerCursor.remove();
      callbacks.push(function() {
        cb(null, seller);
      });
    }
  }
};

