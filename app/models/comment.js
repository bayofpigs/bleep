var mongo = require('mongodb').MongoClient;

module.exports = function(db) {
  function Comment(title, content, author) {
    this.title = title;
    this.content = content; 
    this.author = author;
  }

  Comment.prototype.save = function(postId) {
    this.postId = postId;
      
  }
};