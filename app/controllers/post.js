var PostGenerator = require('../models/post');
var posts_per_page = 10;
var appRoot = process.cwd();
var path = require('path');

module.exports = function(db) {
  var Post = PostGenerator(db);
  var blogName = require(path.join(appRoot, 'config.json')).title;

  var exports = {
    postPage: function(req, res, next) {
      var page = req.param('page');

      Post.fetchPage(page, posts_per_page, function(err, posts) {
        if (err) {
          return next(err);
        }

        res.render("index", {blogname: blogName, posts: posts});
      })
    },
    index: function(req, res) {
      Post.fetchPage(1, posts_per_page, function(err, posts) {
        if (err) {
          return next(err);
        }

        res.render("index", {blogname: blogName, posts: posts});
      })
    }
  }

  return exports
}