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
      function setConfigurationInDatabase(callback) {
        MongoClient.connect(util.format("mongodb://%s:%s/%s", mongoHost, port, databaseName), 
          function(err, database) {
          db = database;
          var configuration = db.collection("configuration");
          
          configuration.update({type: "bloginfo"}, 
            {$set: {title: req.body.title, author: req.body.name}},
            {upsert: true},

            function (err, docs) {
            console.log(docs);

            callback(err);
          });
        });
      },
      function handleAuthentication(callback) {
        authentication(db).savePassword(req.body.password, function(err) {
          callback(err);
        });
      }
    ],
    function(err) {
      if (err) {
        next(err);
      }
    });


    res.send("Derp");
  });

  return router;
}