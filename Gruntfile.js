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
        bump: {
            options: {
                pushTo: 'origin'
            }
        },
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
                options:{
                    bower:{
                    directory: "./test/files/bower_components",
                    file: "./test/files/bower.json",
                    exclude: ['angular-bootstrap']
                },
                glob: {
                    directories: ["test/files/app", "test/files/_base"]
                    }
                }
            }
        },
        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    require('load-grunt-tasks')(grunt);
    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['get_browser_files', 'checkResult']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

    grunt.registerTask('checkResult', function(){
        console.log(grunt.config('get_browser_files.bower'));
        console.log(grunt.config('get_browser_files.app'));
    });
};
