/*
 * grunt-get-browser-files
 * https://github.com/Abrissirba/grunt-get-browser-files
 *
 * Copyright (c) 2015 Marcus Abrahamsson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    get_browser_files: {
      default_options: {
        options: {
          bowerDirectory: "./test/files/bower_components",
          bowerFile: "./test/files/bower.json",
          bowerExclude: ['angular-bootstrap'],
          appDirectories: ["test/files/app", "test/files/_base"]
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['get_browser_files', 'checkResult']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  grunt.registerTask('checkResult', function(){
    console.log(grunt.config('get_browser_files.files'));
  });
};
