/* 
 * Routes for setup page
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var authentication = require('../../util/authentication');
var routesManager = require('../../util/routesmanager');
var util = require('util');
var path = require('path');
var fs = require('fs');

module.exports = function(app, indexRoutes) {
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));

  /* GET setup page */
  router.get('/setup', function(req, res) {
    res.render('index');
  });

  /* Redirect route to setup page */
  router.get('/', function(req, res) {
    res.redirect('/setup');
  });


  router.post('/setup', function(req, res, next) {
    console.log(req.body);
    var mongoHost = req.body.mongohost;
    var databaseName = req.body.database;
    var port = req.body.port;
    var db;

    async.series([
      function setInitialSiteConfiguration(callback) {
        MongoClient.connect(util.format("mongodb://%s:%s/%s", mongoHost, port, databaseName), 
          function(err, database) {
          db = database;
          var configuration = db.collection("configuration");

          async.parallel([
            function insertBlogInformation(cb) {
              configuration.update({type: "bloginfo"}, 
                {$set: {title: req.body.title, author: req.body.name}},
                {upsert: true},
              function (err, docs) {
                return cb(err);
              });
            },
            function insertOtherInformation(cb) {
              configuration.update({type: "settings"},
                {$set: {theme: "default"}},
                {upsert: true},
              function(err, docs) {
                return cb(err);
              });
            }
          ],
          function(err) {
            return callback(err);
          });
        });
      },
      function registerAdminUser(callback) {
        authentication(db).savePassword(req.body.password, function(err) {
          callback(err);
        });
      }, 
      function writeConfig(callback) {
        var output = {};
        output.title = req.body.title;
        output.database = {};
        output.database.host = mongoHost;
        output.database.port = port;
        output.database.db = databaseName;
        output.themes = "assets/themes";
        fs.writeFile(path.join(process.cwd(), "config.json"), 
          JSON.stringify(output, null, 4), 
          function(err) {
          if (err) {
            return callback(err);
          }

          callback(null);
        });
      }
    ],
    function(err) {
      if (err) {
        return next(err);
      }

      
    });


    res.send("Derp");
  });

  return router;
}