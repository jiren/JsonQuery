
# grunt-jslint

[![Build Status](https://travis-ci.org/stephenmathieson/grunt-jslint.png?branch=master)](https://travis-ci.org/stephenmathieson/grunt-jslint) [![Dependency Status](https://gemnasium.com/stephenmathieson/grunt-jslint.png)](https://gemnasium.com/stephenmathieson/grunt-jslint)

Validates JavaScript files with [JSLint] as a [grunt] task.

## Installation
Install this grunt plugin next to your project's [Gruntfile][getting_started] with: `npm install grunt-jslint`

Then add this line to your project's gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jslint');
```

## Documentation

A multi-task to validate your JavaScript files with JSLint.

Supports the following options:

- **files** An array of files or [wildcards] which you want to be validated by JSLint
- **exclude** An array of files or [wildcards] which you do *not* want to be validated by JSLint
- **directives** Configuration options/settings to pre-define in JSLint.  Pre-defined globals are included within this object as `predef: ['myglobal']`
- **options**
    - **errorsOnly** A Boolean option which tells the plugin to only display errors when set to `true`
    - **log** A String/filepath option which, when provided, tells the plugin where to write a verbose log to
    - **junit** A String/filepath option which, when provided, tells the plugin where to write a JUnit-style XML file to
    - **failOnError** A Boolean option - defaults to `true`; when set to `false`, grunt will not fail if JSLint detects an error
    - **checkstyle** A String/filepath option which, when provided, tells the plugin where to write a CheckStyle-XML file to
    - **shebang** Ignore shebang lines (`#!/usr/bin/whatever`) from files
    - **edition** Specify edition of jslint to use.  Either a date which is a JSLint edition (see node_modules/jslint/lib for valid choices), or 'latest' for the latest version, or a path (absolute *or* relative to process current directory) to the JSLint


## Example Usage

```javascript
module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-jslint'); // load the task

  grunt.initConfig({
    jslint: { // configure the task
      // lint your project's server code
      server: {
        src: [ // some example files
          'server/lib/*.js',
          'server/routes/*.js',
          'server/*.js',
          'server/test/*.js'
        ],
        exclude: [
          'server/config.js'
        ],
        directives: { // example directives
          node: true,
          todo: true
        },
        options: {
          edition: 'latest', // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path
          junit: 'out/server-junit.xml', // write the output to a JUnit XML
          log: 'out/server-lint.log',
          jslintXml: 'out/server-jslint.xml',
          errorsOnly: true, // only display errors
          failOnError: false, // defaults to true
          checkstyle: 'out/server-checkstyle.xml' // write a checkstyle-XML
        }
      },
      // lint your project's client code
      client: {
        src: [
          'client/**/*.js'
        ],
        directives: {
          browser: true,
          predef: [
            'jQuery'
          ]
        },
        options: {
          junit: 'out/client-junit.xml'
        }
      }
    }
  });

  grunt.registerTask('default', 'jslint');
};
```

## Contributing

All files should be validated with JSLint.  Bug fixes and/or new features must be accompanied by a passing test.  Tests are written with [vows](http://vowsjs.org/).

### Validating coding style

Run `grunt jslint` in the root of your repository.

### Running the tests

Run `make test` in the root of your repository.

## License
Copyright (c) 2013 Stephen Mathieson
Licensed under the WTFPL license.

[npm_registry_page]: http://search.npmjs.org/#/grunt-jslint
[grunt]: http://gruntjs.com/
[getting_started]: http://gruntjs.com/getting-started#the-gruntfile
[wildcards]: http://gruntjs.com/configuring-tasks#files
[JSLint]: https://github.com/douglascrockford/JSLint
