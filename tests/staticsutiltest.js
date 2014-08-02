var assert = require("assert");
var express = require('express');
var statics = require('../app/util/staticmanager.js');

describe ('Statics', function() {
  describe ('Static insertion', function() {
    it ("Should insert static middleware in the right location, assuming app has not started", function() {
      var app1 = express();
      app1.use("/path", express.static("/dummydir"));

      var app2 = express();
      statics.add(app2, "/dummydir", "/path");

      var app1_stack = app1._router.stack;
      var app2_stack = app2._router.stack;

      assert.equal(app1_stack.length, app2_stack.length);
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

  describe ('Static deletion', function() {
    it ("should remove statics correctly regardless of whether a slash is present", function() {
      var app1 = express();
      app1.use("/path", express.static("/dummydir"));

      var app2 = express();
      app2.use("path", express.static("/dummydir"));

      var app3 = express();
      app3.use("path/", express.static("/dummydir"));

      var app4 = express();
      app4.use("/", express.static("/dummydir"));

      var app1_stack = app1._router.stack;
      var app2_stack = app2._router.stack;
      var app3_stack = app3._router.stack;
      var app4_stack = app4._router.stack;

      statics.purge(app1, "/path");
      statics.purge(app2, "path");
      statics.purge(app3, "path/");
      statics.purge(app4, "/");

      var statics1_exists = false;
      var statics2_exists = false;
      var statics3_exists = false;
      var statics4_exists = false;

      console.log(app4_stack);

      assert.equal(app1_stack.length, app2_stack.length);
      assert.equal(app1_stack.length, app3_stack.length);
      assert.equal(app1_stack.length, app4_stack.length);
      for (var i = 0; i < app1_stack.length; i++) {
        var mid1 = app1_stack[i];
        var mid2 = app2_stack[i];
        var mid3 = app3_stack[i];
        var mid4 = app4_stack[i];

        if (mid1.handle.name === "staticMiddleware") {
          statics1_exists = true;
        }

        if (mid2.handle.name === "staticMiddleware") {
          statics2_exists = true;
        }

        if (mid3.handle.name === "staticMiddleware") {
          statics3_exists = true;
        }

        if (mid4.handle.name === "staticMiddleware") {
          statics4_exists = true;
        }
      }

      assert.equal(statics1_exists, false);
      assert.equal(statics2_exists, false);
      assert.equal(statics3_exists, false);
      assert.equal(statics4_exists, false);
    })
  })
});