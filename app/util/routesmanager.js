/* 
 * A utility library for managing express routes.
 * NOTE: this library is highly implementation-dependent
 * and is based on an understanding of the underlying 
 * structure of Express. It may be subject to change with
 * future updates to the framework.
 */

var express = require('express');

var Statics = {};

var getRegexpName = function(pathName) {
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
}