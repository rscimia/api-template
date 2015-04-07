'use strict';

var fs = require('fs'),
    express = require('express'),

    bodyParser = require('body-parser'),

    server = {},
    config = null,
    app = null,
    connection = null,
    status = null;

server.init = function() {
  // Avoid initializing twice.
  if (status !== null)
    return;

  // Loading configuration.
  config = require('./config/config.json');

  // creating express server.
  app = express();

  // Adding body-parser middleware to handle incomming JSON in request body.
  app.use(bodyParser.json());

  // routes definitions.
  require('./src/routing.js')(app);

  status = 'initialized';
};

server.start = function() {
  // Do not start without configuration and routing.
  if (!(status === 'initialized' || status === 'stopped'))
    server.init();

  // Starting to listen.
  connection = app.listen(config.port);
  console.log('Started server :', config.host, config.port.toString());

  // Prevent from server rage quit on exception.
  if (config.preventException) {
    connection.on('error', function(err) {
      console.error(err.code, err.message);
    });
    process.on('uncaughtException', function(err) {
      console.error(err.code, err.message);
    });
  }

  status = 'started';
};

server.stop = function() {
  connection.close();
  console.log('Stopped server :', config.host, config.port.toString());

  status = 'stopped';
};


module.exports = server;
