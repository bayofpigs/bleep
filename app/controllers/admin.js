var PostGenerator = require('../models/post');
var posts_per_page = 25;
var appRoot = process.cwd();
var path = require('path');

module.exports = function(db) {
  var Post = PostGenerator(db);

  var exports = {
    home: function(req, res) {
      Post.fetchPage(1, posts_per_page, function(err, posts) {
        if (err) {
          return next(err);
        }

        res.render("admin", {posts: posts});
      });
    },
    page: function(req, res) {
      var page = req.param('page');

      Post.fetchPage(page, posts_per_page, function(err, posts) {
        if (err) {
          return next(err);
        }

        res.render("admin", {posts: posts});
      });
    }, 
    pageDefault: function(req, res) {
      res.redirect('/admin/page/1');
    },
    login: function(req, res) {
      res.render("login");
    },
    handleLogin: function(req, res) {

      req.logIn(req.body.password, function(err, result, message) {

        if (err || !result) {
          req.flash('error', message);
          return res.redirect('/admin/login');
        }

        req.flash('success', 'Logged in');
        return res.redirect('/admin');
      });
    },

    // Post modifiers
    destroy: function(req, res) {
      if (!req.isAuthenticated) {
        return res.send(403, {message: "Not authorized"}); 
      }

      console.log(req.param('id'));
      Post.fetchById(Number(req.param('id')), function(err, post) {
        if (err) {
          return res.send("Error: " + err);
        }

        post.delete(function(err) {
          if (err) {
            return res.send("Error: " + err);
          }

          return res.send({status: "success"});
        });
      });
    }
  }

  return exports;
}