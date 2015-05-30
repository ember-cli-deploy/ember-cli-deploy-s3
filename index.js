/* jshint node: true */
'use strict';

var Promise   = require('ember-cli/lib/ext/promise');
var minimatch = require('minimatch');

var chalk  = require('chalk');
var blue   = chalk.blue;
var red    = chalk.red;

var validateConfig = require('./lib/utilities/validate-config');
var S3             = require('./lib/s3');

module.exports = {
  name: 'ember-cli-deploy-s3',

  createDeployPlugin: function(options) {
    function _beginMessage(ui, filesToUpload, bucket) {
      ui.write(blue('|    '));
      ui.writeLine(blue('- uploading ' + filesToUpload.length + ' files to `' + bucket + '`'));

      return Promise.resolve();
    }

    function _successMessage(ui, filesToUpload) {
      ui.write(blue('|    '));
      ui.writeLine(blue('- uploaded ' + filesToUpload.length + ' files ok'));

      return Promise.resolve();
    }

    function _errorMessage(ui, error) {
      ui.write(blue('|    '));
      ui.writeLine(red('- ' + error));

      return Promise.reject(error);
    }

    return {
      name: options.name,

      willDeploy: function(context) {
        var deployment = context.deployment;
        var ui         = deployment.ui;
        var config     = deployment.config[this.name] = deployment.config[this.name] || {};

        return validateConfig(ui, config)
          .then(function() {
            ui.write(blue('|    '));
            ui.writeLine(blue('- config ok'));
          });
      },

      upload: function(context) {
        var deployment = context.deployment;
        var ui         = deployment.ui;
        var config     = deployment.config[this.name];

        var filePattern   = config.filePattern;
        var distDir       = context.distDir;
        var distFiles     = context.distFiles || [];
        var gzippedFiles  = context.gzippedFiles || []; // e.g. from ember-cli-deploy-gzip
        var filesToUpload = distFiles.filter(minimatch.filter(filePattern, { matchBase: true }));

        var s3 = context.s3Client || new S3({
          ui: ui,
          config: config,
          client: context.client
        });

        var options = {
          cwd: distDir,
          filePaths: filesToUpload,
          gzippedFilePaths: gzippedFiles,
          prefix: config.prefix,
          bucket: config.bucket
        };

        return _beginMessage(ui, filesToUpload, config.bucket)
          .then(s3.upload.bind(s3, options))
          .then(_successMessage.bind(this, ui, filesToUpload))
          .catch(_errorMessage.bind(this, ui));
      }
    };
  }
};
