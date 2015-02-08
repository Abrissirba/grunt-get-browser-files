'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var browserFiles = require('../tasks/lib/browserFiles');

exports.get_browser_files = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(2);

    var options = {
      bowerDirectory: "./test/files/bower_components",
      bowerFile: "./test/files/bower.json",
      bowerExclude: ['angular-resource'],
      appDirectories: ["./test/files/app", "./test/files/_base"]
    };

    browserFiles.get(options, function(err, files){
      test.equal(files.bower.length, 8);
      test.equal(files.app.length, 10);
      test.done();
    });
  },

  sortFiles: function(test){
    test.expect(1);

    var files = [
      'b/c.js',
      'a/c/d.js',
      '_app.js',
      'a.js',
      'a/a.js',
      'c.js',
      'c/b/a.js',
      'b/f.js'
    ];

    var expected = [
      '_app.js',
      'a.js',
      'c.js',
      'a/a.js',
      'b/c.js',
      'b/f.js',
      'a/c/d.js',
      'c/b/a.js'
    ];

    var sorted = browserFiles.sort(files);

    function isArrayEqual(a, b) {
        var i = a.length;
        if (i !== b.length) {
          return false;
        }
        while (i--) {
            if (a[i] !== b[i]){
              return false;
            }
        }
        return true;
    }

    test.equal(isArrayEqual(sorted, expected), true);

    test.done();
  }
};
