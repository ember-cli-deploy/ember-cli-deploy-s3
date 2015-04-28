var Promise = require('ember-cli/lib/ext/promise');

var chalk  = require('chalk');
var yellow = chalk.yellow;
var blue   = chalk.blue;
var red    = chalk.red;

module.exports = function(ui, config) {
  ui.write(blue('|    '));
  ui.write(blue('- validating config\n'));

  var defaultConfig = {
    region: 'us-east-1',
    filePattern: '**/*.{js,css,png,gif,jpg,map,xml,txt}',
    prefix: ''
  };

  ['region', 'filePattern', 'prefix'].forEach(function(prop) {
    if (!config[prop]) {
      var value = defaultConfig[prop];
      config[prop] = value;
      ui.write(blue('|    '));
      ui.writeLine(yellow('- Missing config: ' + prop + ', using default: `' + value + '`'));
    }
  });

  var promise = Promise.resolve();

  ['accessKeyId', 'secretAccessKey', 'bucket'].forEach(function(prop) {
    if (!config[prop]) {
      ui.write(blue('|    '));
      ui.writeLine(red('- Missing config: `' + prop + '`'));

      promise = Promise.reject();
    }
  });

  return promise;
}
