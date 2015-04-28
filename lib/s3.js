var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var mime       = require('mime');

var Promise    = require('ember-cli/lib/ext/promise');
var denodeify  = Promise.denodeify;
var readFile   = denodeify(fs.readFile);

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

    var ui           = this._ui;
    var cwd          = options.cwd;
    var bucket       = options.bucket;
    var prefix       = options.prefix;
    var acl          = options.acl || 'public-read';
    var filePaths    = options.filePaths || [];
    var cacheControl = 'max-age='+TWO_YEAR_CACHE_PERIOD_IN_SEC+', public';
    var expires      = EXPIRE_IN_2030;

    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }

    var promises = filePaths.map(function(filePath) {
      var basePath    = path.join(cwd, filePath);
      var data        = fs.readFileSync(basePath);
      var contentType = mime.lookup(basePath);
      var key         = path.join(prefix, filePath);

      var params = {
        Bucket: bucket,
        ACL: acl,
        Body: data,
        ContentType: contentType,
        Key: key,
        CacheControl: cacheControl,
        Expires: expires
      };

      return new Promise(function(resolve, reject) {
        this._client.putObject(params, function(error, data) {
          if (error) {
            reject(error);
          } else {
            ui.write(blue('|    '));
            ui.writeLine(blue('- uploaded: ' + filePath));

            resolve();
          }
        });
      }.bind(this));
    }.bind(this));

    return Promise.all(promises);
  }
});
