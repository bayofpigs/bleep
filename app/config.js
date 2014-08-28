var async = require('async');
var theme = require('./util/theme');
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var authentication = require('./util/authentication');
var routes = require('./util/routesmanager')

// Theme configuration settings once database instance is defined
module.exports = function(app, callback, database) {
  async.waterfall([
    // Assuming theme information is preinstalled
    function fetchThemeInformation(cb) {
      var db;

      // Database has been preinitialized (generally in setup)
      if (database) {
        console.log("Database exists: initialized through setup");
        console.log(database);
        db = database;

        theme.fetchTheme(db, function(fetchedTheme) {
          theme.setTheme(fetchedTheme || "default", app);
          cb(null, db);
        });

        return;
      }

      
      var config = require('../config.json').database;
      MongoClient.connect(format('mongodb://%s:%s/%s', config.host, config.port, config.db), 
        function(err, database) {
          db = database;

          theme.fetchTheme(db, function(fetchedTheme) {
            theme.setTheme(fetchedTheme || "default", app);
            cb(null, db);
          });
      });
    },
    function setupAppRoutes(db, cb) {
      // uncomment once favicon is configured
      // app.use(favicon(__dirname + '/assets/shared/favicon.ico'));
      index = indexRouter(db);
      admin = adminRouter(db);
      routes.add(app, admin, "/admin");
      routes.add(app, index, "/");

      cb(null);
    }, 
    function configureNames(cb) {
      var blogName = require(path.join(process.cwd(), 'config.json')).title;
      app.locals.blogname = blogName;

      cb(null);
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



