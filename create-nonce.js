const { v4: uuidv4 } = require('uuid');

module.exports = function() {
  return new Buffer(uuidv4()).toString('base64');
};