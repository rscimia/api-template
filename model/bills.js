'use strict';

var model = require('./model.js'),
    cursor = model.select('bills'),
    error = require('../utils/error.js');

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
  add: function(bill) {
    var err = false;

    if (err = this.formatError(bill))
      return err;

    cursor.push(bill);
    model.commit();
    return bill;
  },
  edit: function(id, bill) {
    var err = false;

    // check bill format
    if (err = this.formatError(bill))
      return err;

    // look for existancy
    var billCursor = cursor.select({id: id});
    if (!billCursor.get())
      return error(404, 'Bill not found.');

    // prevent id changing
    bill.id = id;

    // updating data
    billCursor.edit(bill);
    model.commit();
    return bill;
  },
  read: function(id) {
    var billCursor = cursor.select({id: id});
    if (!billCursor.get())
      return error(404, 'Bill not found.');
    else
      return billCursor.get();
  }
};

