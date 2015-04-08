'use strict';

var billController = require('../controller/bills.js');

function makeRoute(app, info) {
  app[info.method](
    info.route,
    info.action
    );
}

module.exports = function(app) {
  makeRoute(app, billController.create);
  makeRoute(app, billController.update);
  makeRoute(app, billController.read);
  makeRoute(app, billController.delete);
};
