var async = require('async');
var theme = require('./util/theme');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

// Theme configuration settings once database instance is defined
module.exports = function(app, callback) {
  async.waterfall([
    // Assuming theme information is preinstalled
    function fetchThemeInformation(cb) {
      var db;
      var config = require('../config.json').database;
      MongoClient.connect(format('mongodb://%s:%s/%s', config.host, config.port, config.db), 
        function(err, database) {
          db = database;
          theme.fetchTheme(db, function(theme) {
            theme.setTheme(theme || "default", app, function(err) {
              cb(db);
            });
          });
      });
    },
    function setUpAppfunction(db, cb) {
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



