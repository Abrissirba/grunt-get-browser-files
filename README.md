# grunt-get-browser-files

> A grunt task that will return bower files in correct order and all files in any other directory

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-get-browser-files --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-get-browser-files');
```

## The "get_browser_files" task

### Overview
In your project's Gruntfile, add a section named `get_browser_files` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  get_browser_files: {
    default_options: {
      options: {
        bowerDirectory: "./bower_components",
        bowerFile: "./bower.json",
        bowerExclude: ['angular-bootstrap'],
        appDirectories: ["src/_base", "src/app"]
      }
    }
  },
});
```

### Options

#### options.bowerDirectory
Type: `String`
Default value: `./bower_components`

The location of your bower packages

#### options.bowerFile
Type: `String`
Default value: `./bower.json`

The location of you bower.json file

#### options.bowerExclude
Type: `Array`
Default value: `[]`

Names of bower packages that should not be included in the result

#### options.appDirectories
Type: `Array`
Default value: `[]`

Paths to the directories from where js files should be extracted from.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
