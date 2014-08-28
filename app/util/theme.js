var path = require('path');
var async = require('async');
var appRoot = process.cwd();
var themePath = require(path.join(appRoot, 'config.json')).themes;
var staticsManager = require('./staticmanager.js');

var DEFAULT_THEME = "default";

function fetchAbsoluteDirectories(theme, subPath) {
  var themesDirectory = path.join(appRoot, "/app/" + themePath);

  var fullPath = path.join(themesDirectory, theme + "/" + subPath);

  return fullPath;
}

function fetchThemeConfiguration(theme) {
  var configurationPath = fetchAbsoluteDirectories(theme, "theme.json");
  return require(configurationPath);
}

function themeExists(theme, callback) {
  var fullThemePath = fetchAbsoluteDirectories(theme, ".");
  fs.exists(fullThemePath, callback);
}

function allExist(files, callback) {
  var funcList = [];
  for (var i = 0; i < files.length; i++) {
    funcList[i] = (function(fileName) {
      return function(callback) {
        fs.exists(fileName, function(result) {
          callback(null, result);
        });
      }
    })(files[i]);
  }

  async.parallel(funcList, function(err, result) {
    for (var i = 0; i < result.length; i++) {
      if (!result[i]) {
        callback(false);
      }
    }

    callback(true);
  });
}

module.exports = {
  // Finds and returns the currently set theme in database configuration
  fetchTheme: function(db, callback) {
    var configuration = db.collection('configuration');
    configuration.findOne({type: "settings"}, function(err, doc) {
      if (err) {
        return callback(err);
      }

      callback(null, doc.theme);
    })
  },

  setTheme: function(themeName, app) { 
    var themeConfiguration = fetchThemeConfiguration(themeName);
    var statics = themeConfiguration.staticFolders;
    
    for (var i = 0; i < statics.length; i++) {
      console.log("Setting static destination " + statics[i]);
      console.log("to the value of " + fetchAbsoluteDirectories(themeName, statics[i]));

      var staticName = statics[i];
      if (staticName[0] !== "/") {
        staticName = "/" + staticName;
      }

      staticsManager.add(app, fetchAbsoluteDirectories(themeName, statics[i]), staticName);
    }


    var viewsSub = themeConfiguration.views;
    var viewsDirectory = fetchAbsoluteDirectories(themeName, viewsSub);

    console.log("Settings views to be " + viewsDirectory);
    app.set('views', viewsDirectory);

    return;
  }, 

  /*
   * Verify that a theme is valid. Callback "true" if the theme is
   * valid, false otherwise.
   */
  verifyTheme: function(themeName, callback) {
    var requiredViews = ['editor', 'index'];
    var fileNames = [];

    for (var i = 0; i < requiredViews.length; i++) {
      fileNames[i] = fetchAbsoluteDirectories(themeName, requiredViews[i] + ".jade");
    }

    return allExist(fileNames, callback);
  }
}
