var PostGenerator = require('../models/post');
var posts_per_page = 10;
var appRoot = process.cwd();
var path = require('path');

module.exports = function(db) {
  var Post = PostGenerator(db);

  var exports = {
    postPage: function(req, res, next) {
      var page = Number(req.param('page'));

      Post.fetchPage(page, posts_per_page, function(err, posts, more) {
        if (err) {
          return next(err);
        }

        res.render("index", {posts: posts, more: more, nextPage: page + 1});
      });
    },
    postDefault: function(req, res) {
      res.redirect("/posts/1");
    },
    index: function(req, res) {
      Post.fetchPage(1, posts_per_page, function(err, posts, more) {
        if (err) {
          return next(err);
        }

        console.log(more);
        res.render("index", {posts: posts, more: more, nextPage: 1 + 1});
      });
    }
  }

  return exports
}