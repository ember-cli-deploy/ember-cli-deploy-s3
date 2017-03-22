/*eslint-env node*/
var chai  = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var assert = chai.assert;
describe('s3', function() {
  var S3, mockUi, s3Client, plugin, subject;

  before(function() {
    S3 = require('../../lib/s3');
  });

  beforeEach(function() {
    s3Client = {
      putObject: function(params, cb) {
        cb();
      },
      getObject: function(params, cb) {
        cb(new Error("File not found"));
      }
    };
    mockUi = {
      messages: [],
      write: function() {},
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
    plugin = {
      ui: mockUi,
      readConfig: function(propertyName) {
        if (propertyName === 's3Client') {
          return s3Client;
        }
      },
      log: function(message/*, opts */) {
        this.ui.write('|    ');
        this.ui.writeLine('- ' + message);
      }
    };
    subject = new S3({
      plugin: plugin
    });
  });

  describe('#upload', function() {
    it('resolves if all uploads succeed', function() {
      var options = {
        filePaths: ['app.js', 'app.css'],
        cwd: process.cwd() + '/tests/fixtures/dist',
        prefix: 'js-app'
      };

      var promises = subject.upload(options);

      return assert.isFulfilled(promises)
        .then(function() {
          assert.equal(mockUi.messages.length, 2);

          var messages = mockUi.messages.reduce(function(previous, current) {
            if (/- ✔ {2}js-app\/app\.[js|css]/.test(current)) {
              previous.push(current);
            }

            return previous;
          }, []);

          assert.equal(messages.length, 2);
        });
    });

    it('rejects if an upload fails', function() {
      s3Client.putObject = function(params, cb) {
        cb('error uploading');
      };

      var options = {
        filePaths: ['app.js', 'app.css'],
        cwd: process.cwd() + '/tests/fixtures/dist',
        prefix: 'js-app'
      };

      var promises = subject.upload(options);

      return assert.isRejected(promises)
        .then(function() {
        });
    });

    describe('sending the object to s3', function() {
      it('sends the correct params', function() {
        var s3Params;
        s3Client.putObject = function(params, cb) {
          s3Params = params;
          cb();
        };

        var options = {
          filePaths: ['app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          acl: 'public-read',
          bucket: 'some-bucket',
          cacheControl: 'max-age=1234, public',
          expires: '2010'
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function() {
            assert.equal(s3Params.Bucket, 'some-bucket');
            assert.equal(s3Params.ACL, 'public-read');
            assert.equal(s3Params.Body.toString(), 'body: {}\n');
            assert.equal(s3Params.ContentType, 'text/css; charset=utf-8');
            assert.equal(s3Params.Key, 'js-app/app.css');
            assert.equal(s3Params.CacheControl, 'max-age=1234, public');
            assert.equal(s3Params.Expires, '2010');
            assert.isUndefined(s3Params.ContentEncoding);
            assert.isUndefined(s3Params.ServerSideEncryption);
          });
      });

      it('sets ServerSideEncryption using serverSideEncryption', function() {
        var s3Params;
        s3Client.putObject = function(params, cb) {
          s3Params = params;
          cb();
        };

        var options = {
          filePaths: ['app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          acl: 'public-read',
          bucket: 'some-bucket',
          cacheControl: 'max-age=1234, public',
          expires: '2010',
          serverSideEncryption: 'AES256'
        };

        var promise = subject.upload(options);

        return assert.isFulfilled(promise)
          .then(function() {
            assert.equal(s3Params.ServerSideEncryption, 'AES256', 'ServerSideEncryption passed correctly');
        });
      });

      it('sends the correct content type params for gzipped files with .gz extension', function() {
        var s3Params;
        s3Client.putObject = function(params, cb) {
          s3Params = params;
          cb();
        };

        var options = {
          filePaths: ['app.css', 'app.css.gz'],
          gzippedFilePaths: ['app.css.gz'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          acl: 'public-read',
          bucket: 'some-bucket',
          cacheControl: 'max-age=1234, public',
          expires: '2010'
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function() {
            assert.equal(s3Params.ContentType, 'text/css; charset=utf-8');
            assert.equal(s3Params.Key, 'js-app/app.css.gz');
            assert.equal(s3Params.ContentEncoding, 'gzip');
            assert.equal(s3Params.CacheControl, 'max-age=1234, public');
            assert.equal(s3Params.Expires, '2010');
          });
      });

      it('sets the content type using defaultMimeType', function() {
        var s3Params;
        s3Client.putObject = function(params, cb) {
          s3Params = params;
          cb();
        };

        var options = {
          filePaths: ['index'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          defaultMimeType: 'text/html'
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function() {
            assert.equal(s3Params.ContentType, 'text/html; charset=utf-8');
          });
        });

      it('sets the content type to the default', function() {
        var s3Params;
        s3Client.putObject = function(params, cb) {
          s3Params = params;
          cb();
        };

        var options = {
          filePaths: ['index'],
          cwd: process.cwd() + '/tests/fixtures/dist'
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function() {
            assert.equal(s3Params.ContentType, 'application/octet-stream');
          });
        });

      it('returns a promise with an array of the files uploaded', function() {
        s3Client.putObject = function(params, cb) {
          cb();
        };

        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app'
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function(filesUploaded) {
            assert.deepEqual(filesUploaded, ['app.js', 'app.css']);
          });
      });
    });

    describe('with a manifestPath specified', function () {
      it('uploads all files when manifest is missing from server', function () {
        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          manifestPath: 'manifest.txt'
        };

        var promise = subject.upload(options);

        return assert.isFulfilled(promise)
          .then(function(filesUploaded) {
            assert.equal(mockUi.messages.length, 5);
            assert.match(mockUi.messages[0], /- Downloading manifest for differential deploy.../);
            assert.match(mockUi.messages[1], /- Manifest not found. Disabling differential deploy\./);
            assert.match(mockUi.messages[2], /- ✔ {2}js-app\/app\.js/);
            assert.match(mockUi.messages[3], /- ✔ {2}js-app\/app\.css/);
            assert.match(mockUi.messages[4], /- ✔ {2}js-app\/manifest\.txt/);
            assert.deepEqual(filesUploaded, ['app.js', 'app.css', 'manifest.txt']);
          });
      });

      it('only uploads missing files when manifest is present on server', function () {
        s3Client.getObject = function(params, cb) {
          cb(undefined, {
            Body: "app.js"
          });
        };

        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          manifestPath: 'manifest.txt'
        };

        var promise = subject.upload(options);

        return assert.isFulfilled(promise)
          .then(function(filesUploaded) {
            assert.equal(mockUi.messages.length, 4);
            assert.match(mockUi.messages[0], /- Downloading manifest for differential deploy.../);
            assert.match(mockUi.messages[1], /- Manifest found. Differential deploy will be applied\./);
            assert.match(mockUi.messages[2], /- ✔ {2}js-app\/app\.css/);
            assert.match(mockUi.messages[3], /- ✔ {2}js-app\/manifest\.txt/);
            assert.deepEqual(filesUploaded, ['app.css', 'manifest.txt']);
          });
      });

      it('does not upload manifest.txt when one of the files does not succeed uploading', function() {
        s3Client.putObject = function(params, cb) {
          if (params.Key === 'js-app/app.css') {
            cb('error uploading');
          } else {
            cb();
          }
        };

        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          manifestPath: 'manifest.txt'
        };

        var promise = subject.upload(options);

        return assert.isRejected(promise)
          .then(function() {
            assert.equal(mockUi.messages.length, 3);
            assert.match(mockUi.messages[0], /- Downloading manifest for differential deploy.../);
            assert.match(mockUi.messages[1], /- Manifest not found. Disabling differential deploy\./);
            assert.match(mockUi.messages[2], /- ✔ {2}js-app\/app\.js/);
          });
      });
    });

    describe('with an integer batchSize specified', function () {
      it('uploads all files', function () {
        var options = {
        filePaths: ['app.js', 'app.css'],
        cwd: process.cwd() + '/tests/fixtures/dist',
        prefix: 'js-app',
        batchSize: 10
      };

      var promises = subject.upload(options);

      return assert.isFulfilled(promises)
        .then(function() {
          assert.equal(mockUi.messages.length, 2);

          var messages = mockUi.messages.reduce(function(previous, current) {
            if (/- ✔ {2}js-app\/app\.[js|css]/.test(current)) {
              previous.push(current);
            }

            return previous;
          }, []);

          assert.equal(messages.length, 2);
        });
      });

      it('returns a promise with an array of the files uploaded', function() {
        s3Client.putObject = function(params, cb) {
          cb();
        };

        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          batchSize: 10
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function(filesUploaded) {
            assert.deepEqual(filesUploaded, ['app.js', 'app.css']);
          });
      });

      it('uploads the correct number of batches', function () {
        var requests = 0;

        s3Client.putObject = function (params, cb) {
          requests++;
          cb();
        };

        var oldPutObjectsBatch = subject._putObjectsBatch.bind(subject);
        var called = false;

        //Spy on _putObjectsBatch, making sure that after it has executed a batch it has created 2 requests
        subject._putObjectsBatch = function (paths, options) {
          if (!called) {
            called = true;
            return oldPutObjectsBatch(paths, options);
          }

          assert.equal(requests, 2);

          subject._putObjectsBatch = oldPutObjectsBatch;
          return subject._putObjectsBatch(paths, options);
        };

        var options = {
          filePaths: ['app.js', 'app.css', 'app.css.gz', 'manifest.txt'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          batchSize: 2
        };

        return subject.upload(options)
          .then(function () {
            assert.equal(requests, 4);
          });
      });

      it('rejects if an upload fails', function () {
        s3Client.putObject = function(params, cb) {
          cb('error uploading');
        };

        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          batchSize: 10
        };

        var promises = subject.upload(options);

        return assert.isRejected(promises);
      });
    });
  });
});
