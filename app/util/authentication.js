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

  var adminConfiguration = db.collection("admin");

  /* Get value from the authentication configuration collection of the database */
  var get = function(field) {

  };

  var set = function(field, value) {
    var setObject = {};
    setObject[field] = value;
    adminConfiguration.update({field: "password"}, {$set: setObject}, {upsert: true});
  };

  /* set new value into the database */
  var setObject = function(object, cb) {
    if (!(object[options.hashField] && object[options.saltField])) {
      cb(new Error("Necessary fields not set"));
    }

    object["field"] = "password";
    adminConfiguration.update({field: "password"}, {$set: object}, {upsert: true}, cb);
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

        // Write new Buffer(hashRaw, 'binary').toString(options.encoding)) to 'hash' field of document
        // write salt to 'salt' field of document
        /*
        set(options.hashField, new Buffer(hashRaw, 'binary').toString(options.encoding));
        set(options.saltField, salt);
        */
        setObject(cryptoObject, function(err, doc) {
          cb(err);
        })
      });

    })
  };

  var exports = function(req, res, next) {
    req.logIn = function(password, cb) {

    };

    req.logOut = function() {

    };
  };

  exports.savePassword = saveAdministratorPassword;

  return exports;
};






