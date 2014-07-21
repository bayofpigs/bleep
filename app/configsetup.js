var path = require('path');
module.exports = function(app, callback) {
  app.set('views', path.join(__dirname, '/setupassets/views'))
  callback(null);
}