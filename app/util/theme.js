var path = require('path');
var appRoot = process.cwd();
var config = require(path.join(appRoot, 'config.json')).theme;

var DEFAULT_THEME = "default";

module.exports = {
  fetchTheme:  function(db, callback) {
    callback(null);
  },
  setTheme:    function(themeName, app, callback) {
    callback(null);
  }, 
  verifyTheme: function(themeName, callback) {

  }
}