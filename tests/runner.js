/*eslint-env node*/
'use strict';

var glob = require('glob');
var Mocha = require('mocha');

var mocha = new Mocha({
  reporter: 'spec'
});

var arg = process.argv[2];
var root = 'tests/';

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

addFiles(mocha, '/**/*-test.js');

if (arg === 'all') {
  addFiles(mocha, '/**/*-test-slow.js');
}

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});
