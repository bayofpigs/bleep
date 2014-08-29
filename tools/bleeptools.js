var postmakerGenerator = require('./postmaker');
var MongoClient = require('mongodb').MongoClient;
var config = require('../config.json');
var util = require('util');

function postGen(args) {
  if (args.length != 1) {
    return console.log("Invalid number of arguments");
  }

  var db = config.database;
  MongoClient.connect(util.format("mongodb://%s:%s/%s", db.host, db.port, db.db),
    function(err, database) {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      var postmaker = postmakerGenerator(database);
      postmaker(args[0]);
    });
}

(function() {
  var Post = require('../app/models/post');

  var usagePost = [
    "Usage: bleeptools.js <command>",
    "commands: ",
    "postgen <number of posts>"
  ]
  var usage = usagePost.join("\n");

  var args = process.argv;
  var startIndex = args.indexOf(process.cwd() + "/bleeptools.js");
  if (startIndex === (args.length - 1)) {
    return console.log(usage);
  }

  var command = args[startIndex + 1];
  var commandArgs = args.splice(startIndex + 2);
  switch(command) {
    case "postgen":
    postGen(commandArgs);
    break;
  }

})();