/* 
 * A utility library for managing express statics.
 * NOTE: this library is highly implementation-dependent
 * and is based on an understanding of the underlying 
 * structure of Express. It may be subject to change with
 * future updates to the framework.
 */
var express = require('express');

var Statics = {};

/* Helper method */
var getRegexpName = function(pathName) {
  pathName = pathName.trim();

  // Remove header
  if (pathName.charAt(0) === "\/") {
    pathName = pathName.replace("\/", "\\\/");
  }

  // /^\/setup\/?(?=\/|$)/i
  return "\/^" + pathName + "\\\/?(?=\\\/|$)\/i";
};

/*
 * Utility for adding an express.static() path to the 
 * middleware stack after the application is listening.
 * Statics cannot be added after the server has started
 * as the error-handling middleware would be placed before.
 * @param path = the full path of the static directory
 * @param dirName = the "directory" associated with the path
 *                  to be used in views
 */
Statics.add = function(app, path, dirName) {
  // Add the static directory tot he stack
  app.use(dirName, express.static(path));

  // The stack
  var statics = app._router.stack;
  var index = -1;

};

/*
 * Utility for removing an express.static() path, or the inverse
 * of Statics.
 * @param app = the express app to perform the removal on
 * @param pathname = the static path to perform the removal on
 */
Statics.purge = function(app, path) {
  // reference to app statics
  var statics = app._router.stack;
  var index = -1;
  for (var i = 0; i < statics.length; i++) {
    var middleware = statics[i];

    console.log(middleware.regexp);
    console.log(getRegexpName(path));

    if (middleware.handle.name === "staticMiddleware" && 
      middleware.regexp.toString() === getRegexpName(path)) {
      var index = i;
      break;
    }
  }

  if (index != -1) {
    statics.splice(index, 1);
  }
};

module.exports = Statics;