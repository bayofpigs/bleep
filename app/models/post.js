var mongo = require('mongodb').MongoClient;

module.exports = function(db) {

  function getNextPostId(callback) {
    var counters = db.collection('counters');
    var ret = counters.findAndModify(
      {_id: "postid"}, [],
      {$inc: { seq: 1 }}, {},
      function(err, doc) {
      callback(err, doc.seq);
    });
  }

  function postInitCallbackGenerator(callback) {
    return function(err, result) {
      if (err) {
        callback(err);
      }

      var posts = [];
      for (var i = 0; i < result.length; i++) {
        var doc = result[i];
        posts[i] = new Post(doc.title, doc.content, doc.comments);
        posts[i].id = doc._id;
        posts[i].dateModified = doc.dateModified;
      }

      callback(null, posts);
    }
  }

  var Post = function(title, content, comments) {
    this.comments = [];
    if (comments) {
      for (var i = 0; i < comments.length; i++) {
        this.comments[i] = comments[i];
      }
    }

    this.content = content;
    this.title = title;
  };

  Post.fetchAll = function(callback) {
    var posts = db.collection('posts');
    posts.find().toArray(postInitCallbackGenerator(callback));
  };

  Post.fetchByMonth = function(date, callback) {
    var posts = db.collection('posts');

    var afterDate = new Date(date.getFullYear(), date.getMonth(), 1);
    var beforeDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    posts.find({ dateModified: {$gte: afterDate, $lt: beforeDate}})
         .toArray(postInitCallbackGenerator(callback));
  };

  Post.fetchByDate = function(date, callback) {
    var posts = db.collection('posts');

    var afterDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var beforeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    posts.find({ dateModified: {$gte: afterDate, $lt: beforeDate}})
         .toArray(postInitCallbackGenerator(callback));
  };

  Post.fetchByYear = function(date, callback) {
    var posts = db.collection('posts');
    var afterDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var beforeDate = new Date(date.getFullYear + 1, date.getMonth(), date.getDate());
    posts.find({ dateModified: {$gte: afterDate, $lt: beforeDate}})
         .toArray(postInitCallbackGenerator(callback));
  }

  Post.fetchPage = function(pageNum, postsPerPage, callback) {
    if (pageNum <= 0) {
      console.log("Got error");
      callback(Error("Attempted fetchPage: " + pageNum + ", but page must be greater than 0"));
    }
    Post.fetchAll(function(err, posts) {
      if (err) {
        callback(err);
      }

      // Are there still more posts?

      var min = (pageNum - 1) * postsPerPage;
      var more = ((min + postsPerPage) < posts.length);

      console.log(min);
      console.log(postsPerPage);
      console.log(posts.length);
      callback(null, posts.slice(min, min + postsPerPage), more);
    });
  }

  Post.fetchIdRangePage = function(pageNum, postsPerPage, callback) {
    if (pageNum <= 0) {
      console.log("Got error");
      callback(Error("Attempted fetchPage: " + pageNum + ", but page must be greater than 0"));
    }

    var posts = db.collection('posts');

    var pageLower = (pageNum - 1) * postsPerPage;
    var pageHigher = pageNum * postsPerPage;

    posts.find({ _id: {$gte: pageLower, $lt: pageHigher} }).toArray(function(err, result) {
      if (err) {
        callback(err);
      }

      var posts = [];
      for (var i = 0; i < result.length; i++) {
        var doc = result[i];
        posts[i] = new Post(doc.title, doc.content, doc.comments);
        posts[i].id = doc._id;
        posts[i].dateModified = doc.dateModified;
      }

      callback(null, posts);
    });
  };

  Post.fetchById = function(id, callback) {
    if (id < 0) {
      callback(new Error("Post: Incorrect id parameter: " + id));
    }

    var posts = db.collection('posts');
    posts.findOne({_id: id}, function(err, doc) {
      console.log("FETCHED POST WITH ID " + id);
      if (err) {
        return callback(err);
      }

      var post = new Post(doc.title, doc.content, doc.comments);
      post.id = id;
      post.dateModified = doc.dateModified;

      callback(null, post);
    })
  };

  Post.prototype.delete = function(callback) {
    if (!this.id) {
      callback(new Error("Post: Undefined post id in delete operation"));
    }
    var posts = db.collection('posts');
    posts.remove({_id: this.id}, {w: 1}, function(err) {
      callback(err);
    });
  };

  Post.prototype.addComment = function(comment) {
    this.comments.push(comment);
  };

  Post.prototype.save = function(callback) {
    var posts = db.collection('posts');
    var cur = this;

    if(!cur.id) {
      getNextPostId(function(err, nextId) {
        if (err) {
          return callback(err);
        }

        posts.insert({_id: nextId, 
          content: cur.content,
          title: cur.title,
          comments: cur.comments,
          dateModified: new Date() },
          function(err, docs) {
            if (err) {
              return callback(err);
            }

            callback(null, nextId);
          });
      });
    } else {
      posts.update({_id: cur.id}, 
        { $set: {content: cur.content, 
                title: cur.title,
                comments: cur.comments,
                dateModified: new Date() }},
        {w: 1}, 
        function(err) {
          if (err) {
            return callback(err);
          }

          callback(null, cur.id);
        });
    }
  };

  return Post;
};