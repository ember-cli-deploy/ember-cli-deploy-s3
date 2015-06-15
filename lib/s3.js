/* global require */
var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var mime       = require('mime');

var Promise    = require('ember-cli/lib/ext/promise');

var _          = require('lodash');
var chalk      = require('chalk');
var blue       = chalk.blue;
var EXPIRE_IN_2030               = new Date('2030');
var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;

module.exports = CoreObject.extend({
  init: function(options) {
    var config = options.config;

    var AWS = require('aws-sdk');
    this._client = options.client || new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });

    this._ui = options.ui;
  },

  upload: function(options) {
    options = options || {};
    return this._determineFilePaths(options).then(function(filePaths){
      return Promise.all(this._putObjects(filePaths, options));
    }.bind(this));
  },

  _determineFilePaths: function(options) {
    var ui = this._ui;
    var filePaths = options.filePaths || [];
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    var prefix       = options.prefix;
    var manifestPath = options.manifestPath;
    if (manifestPath) {
      var key = path.join(prefix, manifestPath);
      ui.write(blue('|    '));
      ui.writeLine(blue("- Downloading manifest for differential deploy from `" + key + "`..."));
      return new Promise(function(resolve, reject){
        var params = { Bucket: options.bucket, Key: key};
        this._client.getObject(params, function(error, data) {
          if (error) {
            reject(error);
          } else {
            resolve(data.Body.toString().split('\n'));
          }
        }.bind(this));
      }.bind(this)).then(function(manifestEntries){
      ui.write(blue('|    '));
        ui.writeLine(blue("- Manifest found. Differential deploy will be applied."));
        return _.difference(filePaths, manifestEntries);
      }).catch(function(reason){
        console.log(reason);
        ui.write(blue('|    '));
        ui.writeLine(blue("- Manifest not found. Disabling differential deploy."));
        return Promise.resolve(filePaths);
      });
    } else {
      return Promise.resolve(filePaths);
    }
  },

  _putObjects: function(filePaths, options) {
    var ui               = this._ui;
    var cwd              = options.cwd;
    var bucket           = options.bucket;
    var prefix           = options.prefix;
    var acl              = options.acl || 'public-read';
    var gzippedFilePaths = options.gzippedFilePaths || [];
    var cacheControl     = 'max-age='+TWO_YEAR_CACHE_PERIOD_IN_SEC+', public';
    var expires          = EXPIRE_IN_2030;

    var manifestPath = options.manifestPath;
    var pathsToUpload = filePaths;
    if (manifestPath) {
      pathsToUpload.push(manifestPath);
    }

    return pathsToUpload.map(function(filePath) {
      var basePath    = path.join(cwd, filePath);
      var data        = fs.readFileSync(basePath);
      var contentType = mime.lookup(basePath);
      var key         = path.join(prefix, filePath);
      var isGzipped   = gzippedFilePaths.indexOf(filePath) !== -1;

      var params = {
        Bucket: bucket,
        ACL: acl,
        Body: data,
        ContentType: contentType,
        Key: key,
        CacheControl: cacheControl,
        Expires: expires
      };
      if (isGzipped) {
        params.ContentEncoding = 'gzip';
      }

      return new Promise(function(resolve, reject) {
        this._client.putObject(params, function(error, data) {
          if (error) {
            reject(error);
          } else {
            ui.write(blue('|    '));
            ui.writeLine(blue('- ✔  ' + key));
            resolve(filePath);
          }
        });
      }.bind(this));
    }.bind(this));
  }
});
