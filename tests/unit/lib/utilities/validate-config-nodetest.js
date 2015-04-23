var assert = require('ember-cli/tests/helpers/assert');

describe('validate-config', function() {
  var subject;
  var config;
  var mockUi;

  before(function() {
    subject = require('../../../../lib/utilities/validate-config');
  });

  beforeEach(function() {
    config = {
      accessKeyId: 'aaaa',
      secretAccessKey: 'bbbb',
      bucket: 'cccc',
      region: 'dddd',
      filePattern: 'eeee',
      prefix: 'ffff'
    };

    mockUi = {
      messages: [],
      write: function() {},
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  it('warns about missing optional config', function() {
    delete config.region;
    delete config.filePattern;
    delete config.prefix;

    return assert.isFulfilled(subject(mockUi, config))
      .then(function() {
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing config:\s.*, using default:\s/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 3);
      });
  });

  it('warns about missing required config', function() {
    delete config.accessKeyId;
    delete config.secretAccessKey;
    delete config.bucket;

    return assert.isRejected(subject(mockUi, config))
      .then(function() {
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing config:\s.*/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 3);
      });
  });

  it('adds default config to the config object', function() {
    delete config.region;
    delete config.filePattern;
    delete config.prefix;

    assert.isUndefined(config.region);
    assert.isUndefined(config.filePattern);
    assert.isUndefined(config.prefix);

    return assert.isFulfilled(subject(mockUi, config))
      .then(function() {
        assert.isDefined(config.region);
        assert.isDefined(config.filePattern);
        assert.isDefined(config.prefix);
      });
  });

  it('resolves if config is ok', function() {
    return assert.isFulfilled(subject(mockUi, config));
  })

  it('rejects if config is invalid', function() {
    delete config.accessKeyId;
    delete config.secretAccessKey;
    delete config.bucket;

    return assert.isRejected(subject(mockUi, config));
  });
});
