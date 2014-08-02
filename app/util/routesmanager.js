/* 
 * A utility library for managing express routes.
 * NOTE: this library is highly implementation-dependent
 * and is based on an understanding of the underlying 
 * structure of Express. It may be subject to change with
 * future updates to the framework.
 *
 * NOTE2: This library is in large part a duplicate of 
 * staticmanager.js
 */

var express = require('express');
var Routes = {};

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
 * Utility for adding a router path to the 
 * middleware stack after the application is listening.
 * Routers cannot be added after the server has started
 * as the error-handling middleware would be placed before
 * the router, resulting in the error page always loading.
 * @param app = the express app
 * @param route = the router to add
 * @param dirName = the "directory" associated with the route
 */
Routes.add = function(app, route, dirName) {
  app.use(dirName, route);

    // The stack
  var stack = app._router.stack;

  var expressInitIndex;
  var thisStaticIndex;
  for (var i = 0; i < stack.length; i++) {
    var middleware = stack[i];

    if (middleware.handle.name === "expressInit") {
      expressInitIndex = i;
    } else if (middleware.handle.name === "router") {
      if (regexpCoorespondsToDirname(dirName, middleware.regexp)) {
        thisStaticIndex = i;
      }
    }
  }

  var spliceIndex = expressInitIndex + 1;

  var thisStatic = stack.splice(thisStaticIndex, 1)[0];
  stack.splice(spliceIndex, 0, thisStatic);
};

/*
 * Utility to check if a given router dirName is currently defined.
 * @param app = the express app
 * @param dirName = The express directory name of the router
 */
Routes.defined = function(app, dirName) {
  var statics = app._router.stack;
  for (var i = 0; i < statics.length; i++) {
    var middleware = statics[i];

    if (middleware.handle.name === "router" && 
        regexpCoorespondsToDirname(dirName, middleware.regexp)) {

      return true;
    }
  }

  return false;
}

/*
 * Utility for removing an router, or the inverse
 * of Router.add.
 * @param app = the express app to perform the removal on
 * @param dirName = the router path to perform the removal on
 */
Routes.purge = function(app, dirName) {
  // reference to app statics
  var statics = app._router.stack;
  var index = -1;
  for (var i = 0; i < statics.length; i++) {
    var middleware = statics[i];

    if (middleware.handle.name === "router" &&
      regexpCoorespondsToDirname(dirName, middleware.regexp)) {

      var index = i;
      break;
    }
  }

  if (index != -1) {
    statics.splice(index, 1);
  }
}


module.exports = Routes;
