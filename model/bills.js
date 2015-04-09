'use strict';

var modelClass = require('./model.js'),
    cursor = modelClass.model.select('bills'),
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
    modelClass.saveData();
  }
});




module.exports = {
  cursor: cursor,
  /**
   * Check for formating error in bill object
   * @param  {Object}       bill a bill object
   * @return {Oject|false}       the formating error object or false if no one.
   */
  formatError: function(bill) {
    if (bill === undefined)
      return error(400, 'Missing bill.');

    if (typeof bill.id !== 'string')
      return error(400, 'Invalid bill ID.');

    if (typeof bill.seller !== 'string')
      return error(400, 'Invalid bill seller.');

    if (typeof bill.amount !== 'number')
      return error(400, 'Invalid bill amount.');

    return false;
  },

  /**
   * Add bill to the model
   * @param {Object}   data An object within a bill object on key `bill`
   * @param {Function} cb   A callback function to be executed after insertion.
   */
  add: function(data, cb) {
    var err = false;

    if (err = this.formatError(data.bill))
      cb(err, null);
    else {
      cursor.push(data.bill);
      callbacks.push(function() {
        cb(null, data.bill);
      });
    }
  },

  /**
   * Edit an existing bill in the model
   * @param  {Object}   data An object within a bill object on key `bill`
   *                         and a bill id on key `id`
   * @param  {Function} cb   A callback function to be executed after edition.
   */
  edit: function(data, cb) {
    var err = false;

    // check bill format
    if (err = this.formatError(data.bill))
      cb(err, null);
    else {
      // look for existancy
      var billCursor = cursor.select({id: data.id});
      if (!billCursor.get())
        cb(error(404, 'Bill not found.'), null);
      else {
        // prevent id changing
        data.bill.id = data.id;

        // updating data
        billCursor.edit(data.bill);

        callbacks.push(function() {
          cb(null, data.bill);
        });
      }
    }
  },

  /**
   * Read a bill from the model
   * @param  {Object}   data An object within a bill id on key `id`
   * @param  {Function} cb   A callback function to be executed after reading.
   */
  read: function(data, cb) {
    var billCursor = cursor.select({id: data.id});
    if (!billCursor.get())
      cb(error(404, 'Bill not found.'), null);
    else
      cb(null, billCursor.get());
  },

  /**
   * Delete a bill from the model
   * @param  {Object}   data An object within a bill id on key `id`
   * @param  {Function} cb   A callback function to be executed after deletion.
   */
  delete: function(data, cb) {
    var billCursor = cursor.select({id: data.id}),
        bill = billCursor.get();

    if (!billCursor.get())
      cb(error(404, 'Bill not found.'), null);
    else {
      billCursor.remove();
      callbacks.push(function() {
        cb(null, bill);
      });
    }
  }
};

