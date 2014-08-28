/*
 * Admin authentication middleware. Inspired by 
 * Passport-local-mongoose
 */

var MongoClient = require('mongodb');
var crypto = require('crypto');

module.exports = function(db, options) {
  options = options || {};
  options.saltLen = options.saltLen || 32;
  options.iterations = options.iterations || 25000;
  options.keyLen = options.keyLen || 512;
  options.encoding = options.encoding || 'hex';
  options.hashField = options.hashField || 'hash';
  options.saltField = options.saltField || 'salt';
  options.incorrectPasswordError = options.incorrectPasswordError || "Password is incorrect";

  var adminConfiguration = db.collection("admin");

  /* fetch the password field from the database */
  var getObject = function(cb) {
    adminConfiguration.findOne({field: "password"}, cb);
  };

  /* set new value into the database */
  var setObject = function(object, cb) {
    if (!(object[options.hashField] && object[options.saltField])) {
      cb(new Error("Necessary fields not set"));
    }

    object["field"] = "password";
    adminConfiguration.update({field: "password"}, {$set: object}, {upsert: true}, cb);
  };

  var authenticate = function(password, cb) {
    getObject(function(err, obj) {
      if (err) {
        return console.error(err);
      }

      console.log("FETCHING THE PASSWORD OBJECT: ")
      console.log(obj);

      cb();
      crypto.pbkdf2(password, obj[options.saltField], options.iterations, options.keyLen, function(err, hashRaw) {
        if (err) {
          return cb(err);
        }

        var hash = new Buffer(hashRaw, 'binary').toString(options.encoding);

        if (hash === obj[options.hashField]) {
          cb(null, true);
        } else {
          cb(null, false, options.incorrectPasswordError);
        }
      });
    });
  };

  var saveAdministratorPassword = function(password, cb) {
    crypto.randomBytes(options.saltLen, function(err, buf) {
      if (err) {
        cb(err);
      }

      var salt = buf.toString(options.encoding);

      crypto.pbkdf2(password, salt, options.iterations, options.keyLen, function(err, hashRaw) {
        if (err) {
            return cb(err);
        }

        var cryptoObject = {};
        cryptoObject[options.hashField] = new Buffer(hashRaw, 'binary').toString(options.encoding);
        cryptoObject[options.saltField] = salt;

        setObject(cryptoObject, function(err, doc) {
          cb(err);
        })
      });

    })
  };

  var exports = function(req, res, next) {
    req.logIn = function(password, cb) {
      authenticate(password, function(err, result, message) {
        if (err) {
          return cb(err);
        } else if (!result) {
          return cb(null, result, message);
        }

        req.session.admin = true;
        cb(null, true);
      });
    };

    req.logOut = function() {
      req.session.admin = false;
    };

    req.isAuthenticated = function() {
      return req.session.admin === true;
    };
    
    next();
  };

  exports.savePassword = saveAdministratorPassword;
  exports.ensureAuthenticated = function(req, res, next) {
    console.log("SESSION");
    console.log(req.session);
    if (!req.isAuthenticated()) {
      return res.redirect('/admin/login');
    }

    next();
  };

  return exports;
};