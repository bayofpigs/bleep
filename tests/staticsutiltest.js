var assert = require("assert");
var express = require('express');
var statics = require('../app/util/staticmanager.js');

describe ('Statics', function() {
  describe ('Static insertion', function() {
    it ("Should insert static middleware in the right location, assuming app has not started", function() {
      var app1 = express();
      app1.use("/path", express.static("/dummydir"));

      var app2 = express();
      statics.add(app2, "/dummydir", "path");

      var app1_stack = app1._router.stack;
      var app2_stack = app2._router.stack;

      for (var i = 0; i < app1_stack.length; i++) {
        var mid1 = app1_stack[i];
        var mid2 = app2_stack[i];

        var app1_name = mid1.handle.name;
        var app2_name = mid2.handle.name;

        var app1_regexp = mid1.regexp.toString();
        var app2_regexp = mid2.regexp.toString();

        assert.equal(app1_name, app2_name);
        assert.equal(app1_regexp, app2_regexp);
      }
    });
  });
});