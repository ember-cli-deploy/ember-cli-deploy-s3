/*eslint-env node*/
var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var mime       = require('mime');
var RSVP       = require('rsvp');
var _          = require('lodash');

module.exports = CoreObject.extend({
  init: function(options) {
    this._super(options);
    var AWS = require('aws-sdk');
    var s3Options = {
      region: this.plugin.readConfig('region')
    };

    const proxy = this.plugin.readConfig('proxy');
    if (proxy) {
      this._proxyAgent = this.plugin.readConfig('proxyAgent') || require('proxy-agent');
      s3Options.httpOptions = {
        agent: this._proxyAgent(proxy)
      };
    }

    const accessKeyId = this.plugin.readConfig('accessKeyId');
    const secretAccessKey = this.plugin.readConfig('secretAccessKey');
    const sessionToken = this.plugin.readConfig('sessionToken');
    const profile = this.plugin.readConfig('profile');
    const signatureVersion = this.plugin.readConfig('signatureVersion');

    if (accessKeyId && secretAccessKey) {
      this.plugin.log('Using AWS access key id and secret access key from config', { verbose: true });
      s3Options.accessKeyId = accessKeyId;
      s3Options.secretAccessKey = secretAccessKey;
    }

    if (signatureVersion) {
      this.plugin.log('Using signature version from config', { verbose: true });
      s3Options.signatureVersion = signatureVersion;
    }

    if (sessionToken) {
      this.plugin.log('Using AWS session token from config', { verbose: true });
      s3Options.sessionToken = sessionToken;
    }

    if (profile && !this.plugin.readConfig('s3Client')) {
      this.plugin.log('Using AWS profile from config', { verbose: true });
      AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: profile });
    }

    this._client = this.plugin.readConfig('s3Client') || new AWS.S3(s3Options);
  },

  upload: function(options) {
    options = options || {};
    return this._determineFilePaths(options).then(function(filePaths) {
      const allFilesUploaded = this._putObjects(filePaths, options);

      const manifestPath = options.manifestPath;
      if (manifestPath) {
        return allFilesUploaded.then(function(filesUploaded) {
          return this._putObject(manifestPath, options).then(function(manifestUploaded) {
            return filesUploaded.concat(manifestUploaded);
          });
        }.bind(this));
      } else {
        return allFilesUploaded;
      }
    }.bind(this));
  },

  _determineFilePaths: function(options) {
    var plugin = this.plugin;
    var filePaths = options.filePaths || [];
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    var prefix       = options.prefix;
    var manifestPath = options.manifestPath;
    if (manifestPath) {
      var key = prefix === '' ? manifestPath : [prefix, manifestPath].join('/');
      plugin.log('Downloading manifest for differential deploy from `' + key + '`...', { verbose: true });
      return new RSVP.Promise(function(resolve, reject){
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
        return RSVP.resolve(filePaths);
      });
    } else {
      return RSVP.resolve(filePaths);
    }
  },

  _putObject: function(filePath, options, filePaths) {
    var plugin               = this.plugin;
    var cwd                  = options.cwd;
    var bucket               = options.bucket;
    var prefix               = options.prefix;
    var acl                  = options.acl;
    var gzippedFilePaths     = options.gzippedFilePaths || [];
    var cacheControl         = options.cacheControl;
    var expires              = options.expires;
    var serverSideEncryption = options.serverSideEncryption;

    mime.default_type = options.defaultMimeType || mime.lookup('bin');

    var basePath    = path.join(cwd, filePath);
    var data        = fs.readFileSync(basePath);
    var contentType = mime.lookup(basePath);
    var encoding    = mime.charsets.lookup(contentType);
    var key         = prefix === '' ? filePath : [prefix, filePath].join('/');
    var isGzipped   = gzippedFilePaths.indexOf(filePath) !== -1;

    if (isGzipped && path.extname(basePath) === '.gz') {
      var basePathUncompressed = path.basename(basePath, '.gz');
      if (filePaths && filePaths.indexOf(basePathUncompressed) !== -1) {
        contentType = mime.lookup(basePathUncompressed);
        encoding = mime.charsets.lookup(contentType);
      }
    }

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

    if (serverSideEncryption) {
      params.ServerSideEncryption = serverSideEncryption;
    }

    if (isGzipped) {
      params.ContentEncoding = 'gzip';
    }

    return new RSVP.Promise(function(resolve, reject) {
      this._client.putObject(params, function(error) {
        if (error) {
          reject(error);
        } else {
          plugin.log('✔  ' + key, { verbose: true });
          resolve(filePath);
        }
      });
    }.bind(this));
  },

  _currentEnd: 0,
  _putObjectsBatch: function(filePaths, options) {
    var currentBatch = filePaths.slice(this._currentEnd, Math.min(this._currentEnd + options.batchSize, filePaths.length));

    this._currentEnd += currentBatch.length;

    //Execute our current batch of promises
    return RSVP.all(currentBatch.map(function (filePath) {
      return this._putObject(filePath, options, filePaths);
    }.bind(this)))
    //Then check if we need to execute another batch
    .then(function () {
      if (this._currentEnd < filePaths.length) {
        return this._putObjectsBatch(filePaths, options);
      }

      return filePaths;
    }.bind(this));
  },

  _putObjects: function (filePaths, options) {
    if (options.batchSize > 0) {
      this._currentEnd = 0;
      return this._putObjectsBatch(filePaths, options);
    }

    return RSVP.all(filePaths.map(function (filePath) {
      return this._putObject(filePath, options, filePaths);
    }.bind(this)));
  }
});
