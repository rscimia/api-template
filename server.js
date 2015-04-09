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
  require('./utils/routing.js')(app);

  status = 'initialized';
  return server;
};

server.settings = function(a1, a2) {
  if (a1 === undefined && a2 === undefined) {
    // copy config object to avoid reference
    return Object.keys(config).reduce(function(c, k) {
      c[k] = config[k];
      return c;
    }, {});
  }
  else if (typeof a1 === 'string' && a2 === undefined)
    return config[a1];
  else if (typeof a1 === 'object' && a2 === undefined) {
    Object.keys(a1).forEach(function(k) {
      if (typeof config[k] === typeof a1[k])
        config[k] = a1[k];
    });
  }
  else if (typeof a1 === 'string' && typeof config[a1] === typeof a2)
    config[a1] = a2;

  return server;
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
  return server;
};

server.stop = function() {
  connection.close();
  console.log('Stopped server :', config.host, config.port.toString());

  status = 'stopped';
  return server;
};

server.restart = function() {
  this.stop();
  this.start();
}

module.exports = server;
