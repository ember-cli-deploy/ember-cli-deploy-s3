/* global require */
var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var mime       = require('mime');

var Promise    = require('ember-cli/lib/ext/promise');

var _          = require('lodash');
var EXPIRE_IN_2030               = new Date('2030');
var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;

module.exports = CoreObject.extend({
  init: function(options) {
    this._plugin = options.plugin;
    var AWS = require('aws-sdk');
    var s3Options = {
      region: this._plugin.readConfig('region')
    };
    const accessKeyId = this._plugin.readConfig('accessKeyId');
    const secretAccessKey = this._plugin.readConfig('secretAccessKey');

    if (accessKeyId && secretAccessKey) {
      this._plugin.log('Using AWS access key id and secret access key from config', { verbose: true });
      s3Options.accessKeyId = accessKeyId;
      s3Options.secretAccessKey = secretAccessKey;
    }
    this._client = this._plugin.readConfig('s3Client') || new AWS.S3(s3Options);
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
    var gzippedFilePaths = options.gzippedFilePaths || [];
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    var prefix       = options.prefix;
    if (gzippedFilePaths.length) {
      filePaths = filePaths.concat(gzippedFilePaths);
    }
    var manifestPath = options.manifestPath;
    if (manifestPath) {
      var key = prefix === '' ? manifestPath : [prefix, manifestPath].join('/');
      plugin.log('Downloading manifest for differential deploy from `' + key + '`...', { verbose: true });
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
        plugin.log("Manifest found. Differential deploy will be applied.", { verbose: true });
        return _.difference(filePaths, manifestEntries);
      }).catch(function(/* reason */){
        plugin.log("Manifest not found. Disabling differential deploy.", { color: 'yellow', verbose: true });
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
    var acl              = options.acl;
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
      var key         = prefix === '' ? filePath : [prefix, filePath].join('/');
      var isGzipped   = gzippedFilePaths.indexOf(filePath) !== -1;

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

      return new Promise(function(resolve, reject) {
        this._client.putObject(params, function(error, data) {
          if (error) {
            reject(error);
          } else {
            plugin.log('✔  ' + key, { verbose: true });
            resolve(filePath);
          }
        });
      }.bind(this));
    }.bind(this));
  }
});
