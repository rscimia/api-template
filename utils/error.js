'use strict';

function send(res) {
  res.status(this.code);
  res.send({
    error: this.message
  });
};

module.exports = function(code, message) {
  return {
    code: code,
    message: message,
    send: send
  }
};
