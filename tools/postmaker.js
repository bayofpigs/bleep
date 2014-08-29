var PostGenerator = require('../app/models/post');
module.exports = function(db) {
  var Post = PostGenerator(db);

  // Useful for helper methods
  var titles = ["Derp", "Troll", "d00d wai u hex", "Over 9000", "Trolololol", "git rekt"];
  var content = ["Derp Derp Derp", "ur funny", "so troll", "swag", "yolo"];
  var commentAuthors = ["l33th4x0r24", "sassysass", "derpmanalpha", "funnyguy28"];

  // Helper methods
  var getTitle = function() {
    return titles[Math.floor(Math.random() * titles.length)];
  };

  var getContent = function() {
    var completePost = "";

    var minContent = 50;
    var maxContent = 100;

    var num = Math.floor(Math.random() * (maxContent - minContent) + minContent + 1);

    for (var i = 0; i < num; i++) {
      completePost += content[Math.floor(Math.random() * content.length)];
      completePost += " ";
    }

    return completePost;
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

  var populatePosts = function(num) {
    for (var i = 0; i < num; i++) {
      var newPost = new Post(getTitle(), getContent(), getComments());
      newPost.save(function(err) {
        if (err) {
          console.log("Error: " + err);
        }
      });
    }
  };

  return populatePosts;
};