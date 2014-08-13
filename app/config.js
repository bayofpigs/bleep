var async = require('async');
var theme = require('./util/theme');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

// Theme configuration settings once database instance is defined
module.exports = function(app, callback, database) {
  async.waterfall([
    // Assuming theme information is preinstalled
    function fetchThemeInformation(cb) {
      // Database has been preinitialized (generally in setup)
      if (database) {
        db = database;

        theme.fetchTheme(db, function(fetchedTheme) {
          theme.setTheme(fetchedTheme || "default", app, function(err) {
            cb(db);
          });
        });

        return;
      }

      var db;
      var config = require('../config.json').database;
      MongoClient.connect(format('mongodb://%s:%s/%s', config.host, config.port, config.db), 
        function(err, database) {
          db = database;
          theme.fetchTheme(db, function(fetchedTheme) {
            theme.setTheme(fetchedTheme || "default", app, function(err) {
              cb(db);
            });
          });
      });
    },
    function setupAppRoutes(db, cb) {
      // uncomment once favicon is configured
      // app.use(favicon(__dirname + '/assets/shared/favicon.ico'));
      

      cb(null, app);
    }
  ],
  function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  })
};



