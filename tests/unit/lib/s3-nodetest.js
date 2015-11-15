var assert = require('ember-cli/tests/helpers/assert');

describe('s3', function() {
  var S3, mockUi, s3Client, plugin, subject;

  before(function() {
    S3 = require('../../../lib/s3');
  });

  beforeEach(function() {
    s3Client = {
      putObject: function(params, cb) {
        cb();
      },
      getObject: function(params, cb){
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
      log: function(message, opts) {
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
            if (/- ✔  js-app\/app\.[js|css]/.test(current)) {
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
          bucket: 'some-bucket'
        };

        var promises = subject.upload(options);

        return assert.isFulfilled(promises)
          .then(function() {
            assert.equal(s3Params.Bucket, 'some-bucket');
            assert.equal(s3Params.ACL, 'public-read');
            assert.equal(s3Params.Body.toString(), 'body: {}\n');
            assert.equal(s3Params.ContentType, 'text/css; charset=utf-8');
            assert.equal(s3Params.Key, 'js-app/app.css');
            assert.equal(s3Params.CacheControl, 'max-age=63072000, public');
            assert.deepEqual(s3Params.Expires, new Date('2030'));
          });
      });
    });

    describe('with a manifestPath specified', function () {
      it('uploads all files when manifest is missing from server', function (done) {
        var options = {
          filePaths: ['app.js', 'app.css'],
          cwd: process.cwd() + '/tests/fixtures/dist',
          prefix: 'js-app',
          manifestPath: 'manifest.txt'
        };

        var promise = subject.upload(options);

        return assert.isFulfilled(promise)
          .then(function() {
            assert.equal(mockUi.messages.length, 5);
            assert.match(mockUi.messages[0], /- Downloading manifest for differential deploy.../);
            assert.match(mockUi.messages[1], /- Manifest not found. Disabling differential deploy\./);
            assert.match(mockUi.messages[2], /- ✔  js-app\/app\.js/);
            assert.match(mockUi.messages[3], /- ✔  js-app\/app\.css/);
            assert.match(mockUi.messages[4], /- ✔  js-app\/manifest\.txt/);
            done();
          }).catch(function(reason){
            done(reason);
          });
      });

      it('only uploads missing files when manifest is present on server', function (done) {
        s3Client.getObject = function(params, cb){
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
          .then(function() {
            assert.equal(mockUi.messages.length, 4);
            assert.match(mockUi.messages[0], /- Downloading manifest for differential deploy.../);
            assert.match(mockUi.messages[1], /- Manifest found. Differential deploy will be applied\./);
            assert.match(mockUi.messages[2], /- ✔  js-app\/app\.css/);
            assert.match(mockUi.messages[3], /- ✔  js-app\/manifest\.txt/);
            done();
          }).catch(function(reason){
            done(reason);
          });
      });
    });
  });
});
