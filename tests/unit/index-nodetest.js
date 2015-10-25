'use strict';

var assert = require('ember-cli/tests/helpers/assert');
var Promise = require('ember-cli/lib/ext/promise');

describe('s3 plugin', function() {
  var subject;
  var mockUi;
  var context;

  before(function() {
    subject = require('../../index');
  });

  beforeEach(function() {
    mockUi = {
      verbose: true,
      messages: [],
      write: function() {},
      writeLine: function(message) {
        this.messages.push(message);
      }
    };

    context = {
      distDir: process.cwd() + '/tests/fixtures/dist',
      distFiles: ['app.css', 'app.js'],
      ui: mockUi,
      uploadClient: {
        upload: function(options) {
          return Promise.resolve(['app.css', 'app.js']);
        }
      },
      config: {
        s3: {
          accessKeyId: 'aaaa',
          secretAccessKey: 'bbbb',
          bucket: 'cccc',
          region: 'dddd',
          filePattern: '*.{css,js}',
          prefix: '',
          distDir: function(context) {
            return context.distDir;
          },
          distFiles: function(context) {
            return context.distFiles || [];
          },
          gzippedFiles: function(context) {
            return context.gzippedFiles || []; // e.g. from ember-cli-deploy-gzip
          },
          manifestPath: function(context) {
            return context.manifestPath; // e.g. from ember-cli-deploy-manifest
          },
          uploadClient: function(context) {
            return context.uploadClient; // if you want to provide your own upload client to be used instead of one from this addon
          },
          s3Client: function(context) {
            return context.s3Client; // if you want to provide your own s3 client to be used instead of one from aws-sdk
          }
        }
      }
    };
  });

  it('has a name', function() {
    var plugin = subject.createDeployPlugin({
      name: 's3'
    });

    assert.equal(plugin.name, 's3');
  });

  it('implements the correct hooks', function() {
    var plugin = subject.createDeployPlugin({
      name: 's3'
    });

    assert.typeOf(plugin.configure, 'function');
    assert.typeOf(plugin.upload, 'function');
  });

  describe('configure hook', function() {
    it('does not throw if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });
      plugin.beforeHook(context);
      plugin.configure(context);
      assert.ok(true); // it didn't throw
    });

    it('throws if config is not valid', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.config.s3 = {};

      plugin.beforeHook(context);
      assert.throws(function(){
        plugin.configure(context);
      });
    });
    it('warns about missing optional config', function() {
      delete context.config.s3.region;
      delete context.config.s3.filePattern;
      delete context.config.s3.prefix;

      var plugin = subject.createDeployPlugin({
        name: 's3'
      });
      plugin.beforeHook(context);
      plugin.configure(context);
      var messages = mockUi.messages.reduce(function(previous, current) {
        if (/- Missing config:\s.*, using default:\s/.test(current)) {
          previous.push(current);
        }

        return previous;
      }, []);

      assert.equal(messages.length, 3);
    });

    it('warns about missing required config', function() {
      delete context.config.s3.accessKeyId;
      delete context.config.s3.secretAccessKey;
      delete context.config.s3.bucket;

      var plugin = subject.createDeployPlugin({
        name: 's3'
      });
      plugin.beforeHook(context);
      assert.throws(function(error){
        plugin.configure(context);
      });
      var messages = mockUi.messages.reduce(function(previous, current) {
        if (/- Missing required config:\s.*/.test(current)) {
          previous.push(current);
        }

        return previous;
      }, []);

      assert.equal(messages.length, 1); // doesn't log all failures, just first one
    });

    it('adds default config to the config object', function() {
      delete context.config.s3.region;
      delete context.config.s3.filePattern;
      delete context.config.s3.prefix;

      assert.isUndefined(context.config.s3.region);
      assert.isUndefined(context.config.s3.filePattern);
      assert.isUndefined(context.config.s3.prefix);

      var plugin = subject.createDeployPlugin({
        name: 's3'
      });
      plugin.beforeHook(context);
      plugin.configure(context);

      assert.isDefined(context.config.s3.region);
      assert.isDefined(context.config.s3.filePattern);
      assert.isDefined(context.config.s3.prefix);
    });
  });

  describe('#upload hook', function() {
    it('prints the begin message', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      plugin.beforeHook(context);
      return assert.isFulfilled(plugin.upload(context))
        .then(function() {
          assert.equal(mockUi.messages.length, 2);
          assert.match(mockUi.messages[0], /preparing to upload to S3 bucket `cccc`/);
        });
    });

    it('prints success message when files successully uploaded', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      plugin.beforeHook(context);
      return assert.isFulfilled(plugin.upload(context))
        .then(function() {
          assert.equal(mockUi.messages.length, 2);

          var messages = mockUi.messages.reduce(function(previous, current) {
            if (/- uploaded 2 files ok/.test(current)) {
              previous.push(current);
            }

            return previous;
          }, []);

          assert.equal(messages.length, 1);
        });
    });

    it('prints an error message if the upload errors', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.uploadClient = {
        upload: function(opts) {
          return Promise.reject(new Error('something bad went wrong'));
        }
      };

      plugin.beforeHook(context);
      return assert.isRejected(plugin.upload(context))
        .then(function() {
          assert.equal(mockUi.messages.length, 3);
          assert.match(mockUi.messages[1], /- Error: something bad went wrong/);
        });
    });

    it('sets the appropriate header if the file is inclued in gzippedFiles list', function(done) {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.gzippedFiles = ['app.css'];
      var assertionCount = 0;
      context.uploadClient = null;
      context.s3Client = {
        putObject: function(params, cb) {
          if (params.Key === 'app.css') {
            assert.equal(params.ContentEncoding, 'gzip');
            assertionCount++;
          } else {
            assert.isUndefined(params.ContentEncoding);
            assertionCount++;
          }
          cb();
        },
        getObject: function(params, cb){
          cb(new Error("File not found"));
        }
      };

      plugin.beforeHook(context);
      return assert.isFulfilled(plugin.upload(context)).then(function(){
        assert.equal(assertionCount, 2);
        done();
      }).catch(function(reason){
        done(reason.actual.stack);
      });
    });
  });
});
