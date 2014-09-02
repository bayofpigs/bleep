var PostGenerator = require('../models/post');
var posts_per_page = 10;
var appRoot = process.cwd();
var path = require('path');

module.exports = function(db) {
  var Post = PostGenerator(db);

  function getMonthName(monthNum) {
    var months = ["January", "February", "March", "April", "May",
                  "June", "July", "August", "September", "October",
                  "November", "December"];
    return months[monthNum];
  };

  function getDateString(date) {
    return getMonthName(date.getMonth()) + " " + date.getFullYear();
  };

  function getArchiveDates(cb) {
    var dates = {};
    Post.fetchAll(function(err, posts) {
      if (err) {
        cb(err);
      }

      for (var i = 0; i < posts.length; i++) {
        var modified = posts[i].dateModified;
        dates[getDateString(modified)] = modified;
      }

      var archiveDates = [];
      var dateValues = Object.keys(dates);
      for (var i = 0; i < dateValues.length; i++) {
        var obj = {};
        var dateValue = dateValues[i];

        obj["string"] = dateValue;
        obj["date"] = dates[dateValue];

        archiveDates.push(obj);
      }

      archiveDates.sort(function(d1, d2) {
        return d1.date - d2.date;
      })

      cb(null, archiveDates);
    });
  }

  var exports = {
    postPage: function(req, res, next) {
      var page = Number(req.param('page'));

      if (isNaN(page)) {
        return next();
      }

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
    }, 
    archive: function(req, res, next) {
      getArchiveDates(function(err, dates) {
        if (err) {
          next(err);
        }

        res.render("archive", {dates: dates});
      });
    },
    archiveByDate: function(req, res, next) {
      var month = Number(req.param('month'));
      var year = Number(req.param('year'));
      var fetchDate = new Date(year, month, 1);

      if (isNaN(year)) {
        return next();
      }

      if (isNaN(month)) {
        return next();
      }

      Post.fetchByMonth(fetchDate, function(err, posts) {
        if (err) {
          next (err);
        }

        res.render("index", {posts: posts});
      });
    },
    postIndividual: function(req, res, next) {
      var id = Number(req.param('id'));
      var title = req.param('title');

      if (isNaN(id)) {
        return next();
      }

      Post.fetchById(id, function(err, post) {
        if (err) {
          next();
        }

        res.render('post', {post: post});
      })
    }
  }

  return exports
}




