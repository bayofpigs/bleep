/* 
 * A utility library for managing express statics.
 * NOTE: this library is highly implementation-dependent
 * and is based on an understanding of the underlying 
 * structure of Express. It may be subject to change with
 * future updates to the framework.
 */
var express = require('express');

var Statics = {};

/* Helper method. Generate the expected regex from a given
 * path name                                                */
var getRegexp = function(pathName) {
  pathName = pathName.trim();

  // Remove header
  if (pathName.charAt(0) === "\/") {
    pathName = pathName.replace("\/", "\\\/");
  }

  if (pathName.charAt(pathName.length - 1) == "\/") {
    pathName = pathName.substring(0, pathName.length - 1);
  }

  // /^\/setup\/?(?=\/|$)/i
  return "\/^" + pathName + "\\\/?(?=\\\/|$)\/i";
};

/* Compare two express static regex */
var regexpCoorespondsToDirname = function(dirName, regex) {
  if (dirName === "/" && regex.fast_slash) {
    return true;
  } 

  return getRegexp(dirName) === regex.toString();
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
  var stack = app._router.stack;

  var firstStaticIndex;
  var expressInitIndex;
  var thisStaticIndex;
  for (var i = 0; i < stack.length; i++) {
    var middleware = stack[i];

    if (middleware.handle.name === "expressInit") {
      expressInitIndex = i;
    } else if (middleware.handle.name === "staticMiddleware") {
      if (!firstStaticIndex) firstStaticIndex = i;

      if (regexpCoorespondsToDirname(dirName, middleware.regexp)) {
        thisStaticIndex = i;
      }
    }
  }

  var spliceIndex = expressInitIndex + 1;
  if (firstStaticIndex != thisStaticIndex) {
    spliceIndex = firstStaticIndex + 1;
    
  } 

  var thisStatic = stack.splice(thisStaticIndex, 1)[0];
  stack.splice(spliceIndex, 0, thisStatic);
};

/*
 * Utility to check if a given statics dirName is currently defined.
 * @dirName The express directory name of the static
 */
Statics.defined = function(app, dirName) {
  var statics = app._router.stack;

  for (var i = 0; i < statics.length; i++) {
    var middleware = statics[i];

    if (middleware.handle.name === "staticMiddleware" &&
      regexpCoorespondsToDirname(dirName, middleware.regexp)) {

      return true;
    }
  }

  return false;
}

/*
 * Utility for removing an express.static() path, or the inverse
 * of Statics.add.
 * @param app = the express app to perform the removal on
 * @param dirName = the static path to perform the removal on
 */
Statics.purge = function(app, dirName) {
  // reference to app statics
  var statics = app._router.stack;
  var index = -1;
  for (var i = 0; i < statics.length; i++) {
    var middleware = statics[i];

    if (middleware.handle.name === "staticMiddleware" &&
      regexpCoorespondsToDirname(dirName, middleware.regexp)) {

      var index = i;
      break;
    }
  }

  if (index != -1) {
    statics.splice(index, 1);
  }
};

module.exports = Statics;