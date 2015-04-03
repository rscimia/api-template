'use strict';

var model = require('model');

module.exports= {
      data: mode.select('bills'),
      formatError: function(bill) {
        if (bill === undefined)
          return 'Missing bill.';

        if (typeof bill.id !== 'string')
          return 'Invalid bill ID.';

        if (typeof bill.seller !== 'string')
          return 'Invalid bill seller.';

        if (typeof bill.ammout !== 'number')
          return 'Invalid bill amout.';

        return '';
      }
    };

