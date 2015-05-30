'use strict';

var assert = require('ember-cli/tests/helpers/assert');
var Promise = require('ember-cli');

describe('s3 plugin', function() {
  var subject;
  var mockUi;
  var context;

  before(function() {
    subject = require('../../index');
  });

  beforeEach(function() {
    mockUi = {
      messages: [],
      write: function() {},
      writeLine: function(message) {
        this.messages.push(message);
      }
    };

    context = {
      distDir: process.cwd() + '/tests/fixtures/dist',
      distFiles: ['app.css', 'app.js'],
      deployment: {
        ui: mockUi,
        config: {
          s3: {
            accessKeyId: 'aaaa',
            secretAccessKey: 'bbbb',
            bucket: 'cccc',
            region: 'dddd',
            filePattern: '*.{css,js}',
            prefix: ''
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

    assert.equal(typeof plugin.willDeploy, 'function');
    assert.equal(typeof plugin.upload, 'function');
  });

  describe('willDeploy hook', function() {
    it('resolves if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      return assert.isFulfilled(plugin.willDeploy.call(plugin, context))
    });

    it('rejects if config is not valid', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.deployment.config.s3 = {};

      return assert.isRejected(plugin.willDeploy.call(plugin, context))
    });
  });

  describe('#upload hook', function() {
    it('prints the begin message', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.client = {
        putObject: function(params, cb) {
          cb();
        }
      };

      return assert.isFulfilled(plugin.upload.call(plugin, context))
        .then(function() {
          assert.equal(mockUi.messages.length, 4);

          var messages = mockUi.messages.reduce(function(previous, current) {
            if (/- uploading 2 files to `cccc`/.test(current)) {
              previous.push(current);
            }

            return previous;
          }, []);

          assert.equal(messages.length, 1);
        });
    });

    it('prints success message when files successully uploaded', function() {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.client = {
        putObject: function(params, cb) {
          cb();
        }
      };

      return assert.isFulfilled(plugin.upload.call(plugin, context))
        .then(function() {
          assert.equal(mockUi.messages.length, 4);

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

      context.client = {
        putObject: function(params, cb) {
          cb('something bad went wrong');
        }
      };

      return assert.isRejected(plugin.upload.call(plugin, context))
        .then(function() {
          assert.equal(mockUi.messages.length, 2);
          assert.match(mockUi.messages[1], /- something bad went wrong/);
        });
    });

    it('sets the appropriate header if the file is inclued in gzippedFiles list', function(done) {
      var plugin = subject.createDeployPlugin({
        name: 's3'
      });

      context.gzippedFiles = ['app.css'];
      var assertionCount = 0;
      context.client = {
        putObject: function(params, cb) {
          if (params.Key === 'app.css') {
            assert.equal(params.ContentEncoding, 'gzip');
            assertionCount++;
          } else {
            assert.isUndefined(params.ContentEncoding);
            assertionCount++;
          }
          cb();
        }
      };

      return assert.isFulfilled(plugin.upload.call(plugin, context)).then(function(){
        assert.equal(assertionCount, 2);
        done();
      }).catch(function(reason){
        done(reason.actual.stack);
      });
    });
  });
});
