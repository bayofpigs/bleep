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
var staticManager = require('../../util/staticmanager');
var PostGenerator = require('../../models/post');
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
      /* Drop database, then set configuration */
      function setInitialSiteConfiguration(callback) {
        MongoClient.connect(util.format("mongodb://%s:%s/%s", mongoHost, port, databaseName), 
          function(err, database) {
            if (err) {
              return callback(err);
            }

            db = database;
            var configuration = db.collection("configuration");
            db.dropDatabase(function(err, done) {
              if (err) {
                return callback(err);
              }
              async.parallel([
                function insertBlogInformationConfiguration(cb) {
                  configuration.update({type: "bloginfo"}, 
                    {$set: {title: req.body.title, author: req.body.name}},
                    {upsert: true},
                  function (err, docs) {
                    return cb(err);
                  });
                },
                function insertOtherInformationConfiguration(cb) {
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
        });
      },
      function addIncrementingCountersToDatabase(callback) {
        var counters = db.collection('counters');

        async.parallel([
          function insertPostCounter(cb) {
            counters.insert({_id: "postid", seq: 0}, function(err) {
              if (err) {
                return cb(err);
              }

              return cb(null);
            })
          },
          function insertCommentCounter(cb) {
            counters.insert({_id: "commentid", seq: 0}, function(err) {
              if (err) {
                return cb(err);
              }

              return cb(null);
            })
          }],
        function uponCompletion(err) {
          if (err) {
            return callback(err);
          }

          callback(null);
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
      }, 
      function writeSamplePost(callback) {
        var Post = PostGenerator(db);
        
        var title = "Welcome to Bleep!";
        var content = 
          "<em>Checkout</em> the admin console at /admin to add and modify posts and settings " +
          "To delete this post, find this post under /admin/edit and click DELETE next " +
          "to this post's content. Have fun with your new blog!";
        var comments = [
          { title: "This is a comment", author: "Bleep", content: "Users will opine here."}
        ];

        var post = new Post(title, content, comments);

        console.log(post);
        post.save(function(err) {
          callback(err);
        });
      }
    ],
    function uponCompletionOfAllSetupTasks(err) {
      if (err) {
        return next(err);
      }

      console.log("Purging index route");
      routesManager.purge(app, "/");

      console.log("Purging statics");
      staticManager.purge(app, "/public");
      
      require('../../config')(app, function(err) {
        if (err) { 
          console.error("An error occured: " + err);
          return next(err);
        }

        console.log("Mission completed");
        res.redirect("/");
      }, db);
    });
  });

  return router;
}