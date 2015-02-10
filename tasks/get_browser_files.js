/*
 * grunt-get-browser-files
 * https://github.com/Abrissirba/grunt-get-browser-files
 *
 * Copyright (c) 2015 Marcus Abrahamsson
 * Licensed under the MIT license.
 */

'use strict';

var browserFiles = require('./lib/browserFiles');
var path = require('path');
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('get_browser_files', 'A grunt task that will return bower files in correct order and all files in any other directory', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();
    var options = this.options({});

    browserFiles.get(options, function(err, files){
      grunt.config("get_browser_files.bower.js", files.bower.js);
      grunt.config("get_browser_files.bower.css", files.bower.css);
      grunt.config("get_browser_files.app.js", files.app.js);
      grunt.config("get_browser_files.app.css", files.app.css);
      done();
    });
  });

};
