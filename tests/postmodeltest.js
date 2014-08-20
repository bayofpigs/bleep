var assert = require("assert");
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');

// Useful for helper methods
var titles = ["Derp", "Troll", "d00d wai u hex", "Over 9000", "Trolololol", "git rekt"];
var content = ["Derp Derp Derp", "ur funny", "so troll", "swag", "yolo"];
var commentAuthors = ["l33th4x0r24", "sassysass", "derpmanalpha", "funnyguy28"];

// Helper methods
var getTitle = function() {
  return titles[Math.floor(Math.random() * titles.length)];
};

var getContent = function() {
  return content[Math.floor(Math.random() * content.length)];
};

var getAuthor = function() {
  return commentAuthors[Math.floor(Math.random() * commentAuthors.length)];
};

var getComments = function() {
  var MAX_COMMENTS = 10;
  var comments = [];
  var howMany = Math.ceil(Math.random() * MAX_COMMENTS);
  for (var i = 0; i < howMany; i++) {
    comments[i] = {
      title: getTitle(),
      content: getContent(),
      author: getAuthor()
    };
  }

  return comments;
};

// Tests
describe('Posts:', function() {
  var Post;
  var database;

  before (function(done) {
    var testdbinfo = require('./testdatabaseconfig.json');
    var host = testdbinfo.hostname;
    var port = testdbinfo.port;
    var dbname = testdbinfo.database;
    MongoClient.connect(util.format("mongodb://%s:%s/%s", host, port, dbname), 
      function(err, db) {
        if (err) {
          return done(err);
        }

        database = db;

        // Clear the database
        db.dropDatabase(function(err) {
          if (err) {
            done(err);
          }

          // Add counters to the database
          var counters = db.collection('counters');
          counters.insert({_id: "postid", seq: 0}, function(err) {
            Post = require('../app/models/post')(db);
            done(err);
          });
        });
      });
  });

  describe('Post standard initialization works as expected, without error.', function() {
    var title = "Test post please ignore";
    var content = "Derp I'm a content lol";
    var comments = [{ title: "I am comment", content: "Here my content", author: "email@me.com"}];

    it ('Should not throw an error.', function() {
      var newPost = new Post(title, content, comments);
    });

    it ('Should have correct content.', function() {
      var newPost = new Post(title, content, comments);
      assert.equal(newPost.title, title);
      assert.equal(newPost.content, content);
      assert.deepEqual(newPost.comments, comments);
    });
  });

  describe('New post save works as expected, without error and is correct.', function() {
    var title = getTitle();
    var content = getContent();
    var comments = getComments();

    it ('Should save without error.', function(done) {
      var newPost = new Post(title, content, comments);
      newPost.save(function(err) {
        done(err);
      });
    });

    it ('Should save with the correct values, with the correct id', function(done) {
      Post.fetchById(0, function(err, post) {
        if (err) {
          done(err);
        }

        assert.equal(0, post.id);
        assert.equal(title, post.title);
        assert.equal(content, post.content);


        assert.deepEqual(comments, post.comments);
        done();
      });
    });
  });


  describe ('Posts can handle a large batch of insertions and retrievals', function() {
    var funcList = [];
    var postTitles = [];

    it ('Should be able to handle a large quantity of insertions', function(done) {
      for (var i = 0; i < 300; i++) {
        var title = getTitle();
        postTitles[i + 1] = title;
        var newPost = new Post(title, getContent(), getComments());

        funcList[i] = (function(post, title) {
          return function(callback) {
            post.save(function(err, id) {
              postTitles[id] = title;
              callback();
            })
          }
        })(newPost, title);
      }

      async.parallel(funcList, done);
    });

    it ('Should be able to retrieve a large quantity of inserted data', function(done) {
      Post.fetchAll(function(err, posts) {
        posts.sort(function(post1, post2) {
          return post1.id - post2.id;
        });

        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];

          if (post.id == 0) continue;

          assert.equal(post.title, postTitles[post.id]);
        }

        done();
      });
    });
  });

});









