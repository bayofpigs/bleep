var async = require('async');
var theme = require('./util/theme');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

// Asynchronous configuration
module.exports = function(app, callback) {
  async.waterfall([
    // Assuming theme information is preinstalled
    function fetchThemeInformation(cb) {
      var db;
      var config = require('../config.json').database;
      MongoClient.connect(format('mongodb://%s:%s/%s', config.host, config.port, config.db), 
        function(err, db) {

      });

      cb(null, db);
    },
    function setUpAppfunction(db, cb) {
      app.set('view engine', 'jade');

      // uncomment once favicon is configured
      // app.use(favicon(__dirname + '/assets/shared/favicon.ico'));
      app.use(express.static(path.join(__dirname, 'assets/shared')));

      // Catch 404 errors
      app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      });

      // Error handlers
      // For production
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: {}
        });
      });

      app.set('port', process.env.PORT || 3000);

      cb(null, app);
    }
  ],
  function (err) {
    if (err) {
      console.log(err);
    } else {
      callback(app);
    }
  })
};



