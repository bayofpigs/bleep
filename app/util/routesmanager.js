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

var getRegexpName = function(pathName) {
  pathName = pathName.trim();

  // Remove header
  if (pathName.charAt(0) === "\/") {
    pathName = pathName.replace("\/", "\\\/");
  }

  if (pathName.charAt(pathName.length - 1) == "\/") {
    pathName = pathName.substring(0, pathName.length - 1);
  }

  return "\/^" + pathName + "\\\/?(?=\\\/|$)\/i";
}

/*
 * Utility for adding an express.static() path to the 
 * middleware stack after the application is listening.
 * Statics cannot be added after the server has started
 * as the error-handling middleware would be placed before.
 * @param path = the full path of the static directory
 * @param dirName = the "directory" associated with the path
 *                  to be used in views
 */