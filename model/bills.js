'use strict';

var model = require('./model.js'),
    cursor = model.select('bills'),
    error = require('../utils/error.js'),
    callbacks = [];

cursor.on('update', function() {
  while (callbacks.length) {
    var cb = callbacks.shift();
    cb();
  }
});

module.exports = {
  cursor: cursor,
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
  read: function(data, cb) {
    var billCursor = cursor.select({id: data.id});
    if (!billCursor.get())
      cb(error(404, 'Bill not found.'), null);
    else
      cb(null, billCursor.get());
  },
  delete: function(data, cb) {
    var billCursor = cursor.select({id: data.id});
    if (!billCursor.get())
      cb(error(404, 'Bill not found.'), null);
    else {
      billCursor.remove();
      callbacks.push(function() {
        cb(null, 'ok');
      });
    }
  }
};

