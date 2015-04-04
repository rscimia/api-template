'use strict';

var model = require('./model.js');

module.exports = {
      data: model.select('bills'),
      formatError: function(bill) {
        if (bill === undefined)
          return 'Missing bill.';

        if (typeof bill.id !== 'string')
          return 'Invalid bill ID.';

        if (typeof bill.seller !== 'string')
          return 'Invalid bill seller.';

        if (typeof bill.amount !== 'number')
          return 'Invalid bill amount.';

        return '';
      }
    };

