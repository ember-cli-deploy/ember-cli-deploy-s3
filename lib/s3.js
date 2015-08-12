/* global require */
var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var mime       = require('mime');
var MD5        = require('crypto-js/md5');
var Base64     = require('crypto-js/enc-base64');

var Promise    = require('ember-cli/lib/ext/promise');

var _          = require('lodash');
var EXPIRE_IN_2030               = new Date('2030');
var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;

module.exports = CoreObject.extend({
  init: function(options) {
    this._plugin = options.plugin;
    var AWS = require('aws-sdk');
    this._client = this._plugin.readConfig('s3Client') || new AWS.S3({
      accessKeyId: this._plugin.readConfig('accessKeyId'),
      secretAccessKey: this._plugin.readConfig('secretAccessKey'),
      region: this._plugin.readConfig('region')
    });
  },

  upload: function(options) {
    options = options || {};
    return this._determineFilePaths(options).then(function(filePaths){
      return Promise.all(this._putObjects(filePaths, options));
    }.bind(this));
  },

  _determineFilePaths: function(options) {
    var plugin = this._plugin;
    var filePaths = options.filePaths || [];
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    var prefix       = options.prefix;
    var manifestPath = options.manifestPath;
    if (manifestPath) {
      var key = path.join(prefix, manifestPath);
      plugin.log('Downloading manifest for differential deploy from `' + key + '`...');
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
        plugin.log("Manifest found. Differential deploy will be applied.");
        return _.difference(filePaths, manifestEntries);
      }).catch(function(reason){
        plugin.log("Manifest not found. Disabling differential deploy.", { color: 'yellow' });
        return Promise.resolve(filePaths);
      });
    } else {
      return Promise.resolve(filePaths);
    }
  },

  _putObjects: function(filePaths, options) {
    var plugin           = this._plugin;
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
      var encoding    = mime.charsets.lookup(contentType);
      var key         = path.join(prefix, filePath);
      var isGzipped   = gzippedFilePaths.indexOf(filePath) !== -1;
      var contentMD5;

      if (encoding) {
        contentType += '; charset=';
        contentType += encoding.toLowerCase();
      }

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

      if (!/^image/.test(contentType)) {
        contentMD5  = Base64.stringify(MD5(data.toString()));
        params.ContentMD5 = contentMD5;
      }

      return new Promise(function(resolve, reject) {
        this._client.putObject(params, function(error, data) {
          if (error) {
            reject(error);
          } else {
            plugin.log('✔  ' + key);
            resolve(filePath);
          }
        });
      }.bind(this));
    }.bind(this));
  }
});
