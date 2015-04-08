'use strict';

/**
 * Send error to the client
 * @param  {Object} res Express Response
 */
function send(res) {
  res.status(this.code);
  res.send({
    error: this.message
  });
};

/**
 * Create an error object.
 * @param  {Number} code    HTTP status of the error.
 * @param  {String} message Message of the error.
 * @return {Object}         The error object.
 */
module.exports = function(code, message) {
  return {
    code: code,
    message: message,
    send: send
  }
};
