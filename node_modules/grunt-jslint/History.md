1.1.12 / 2014-05-19
===================

 * package.json: require newer jslint module (>0.5.0)
 * lib/jslint.js: delegate jslint file loading to jslint
 * test/editions.js: use loadJSLint instead of ..fromPath
 * test/jslin.js: use loadJSLint instead of ..fromPath

1.1.11 / 2014-05-08
===================

 * lib/jslint.js: fix Issue #47 (variable aliasing)
 * test/jslint.js: unit test to expose issue

1.1.10 / 2014-05-05
===================

 * lib/jslint.js: remove BOM when present
 * test/jslint.js: unit tests for new fn preprocessScript

1.1.9 / 2014-04-13
==================

 * Readme.md: document new feature, specify edition of jslint by path
 * lib/jslint.js: new function loadJSLintFromPath
 * test/editions.js: add unit test for loadJSLintFromPath

1.1.8 / 2014-03-19
==================

 * Makefile: factor unit tests
 * exclude: factor, add tests, speed up exclude function


1.1.7 / 2014-03-19
==================

 * Revert #39 and fix #41.
 * test: Add acceptance test for exclude

1.1.6 / 2014-03-14
==================

 * Remove JSLint submodule
 * Fix acceptance test runner
 * Refactor makefile
 * Add grunt-cli as a development dep
 * Remove weird stuff from package.json
 * Add missing release notes
 * Use the algorithm JSHint uses for excludes instead of big-O(n^2) array element comparisons...

1.1.5 / 2014-02-14
==================

- Update `jslint` dep
- Fix lint issues
- Add regression tests

1.1.4 / 2014-02-10
==================

- Fix lint issues
- Fix/refactor tests

1.1.3 / 2014-01-02
==================

- Add @smikes as a maintainer

1.1.2 / 2013-12-03
==================

- Removed dead code (see [#33](https://github.com/stephenmathieson/grunt-jslint/issues/33))
- Updated [JSLint to edition 2013-11-23](https://github.com/douglascrockford/JSLint/commit/bd6da6b0eb808cf9c2813d8952591898d8f580b6)

1.1.1 / 2013-09-26
==================

- Updated [JSLint to edition 2013-09-22](https://github.com/douglascrockford/JSLint/commit/256cf8decf04e7dc9012176d81c90b7128fcd30d)

1.1.0 / 2013-09-22
==================

- Updated [JSLint to edition 2013-09-20](https://github.com/douglascrockford/JSLint/commit/502f26ba1f2172ba9b412797ad88b5d709c123f9)
- Exposed current edition of JSLint (`require('grunt-jslint').edition`)

1.0.0 / 2013-07-28
==================

- Moved to a [multi-task](http://gruntjs.com/creating-tasks#multi-tasks), allowing multiple groupings of files to be linted
- Allowing the usage of `globals` rather than `predef`
- Refactored entire project

0.2.6 / 2013-05-23
==================

- Updated [JSLint to edition 2013-05-16](https://github.com/douglascrockford/JSLint/commit/1d8c1f8f7410b505ccbb039a74025cd75a926ce3) per [#25](https://github.com/stephenmathieson/grunt-jslint/issues/25)
- Added a Makefile and replaced *test.sh*

0.2.5 / 2013-03-23
==================

- Make [grunt](http://gruntjs.com/) a devDependency to speed up `npm install` time
- Fixed `failOnError` bug (@glan)
- Fixed JSLint XML bug (@glan)
- Another grunt 0.4.x support bug (@glan)
- Bug fix for XML reports (non-escaped characters)
- Added checkstyle XML reporting
- Added `shebang` option
- Improved test coverage
- Re-factor everything, allowing for a test suite to be created
- Updated the outputted JUnit-style XML for better intergration with Jenkins per @sbrandwoo
- Removed unecessary dependencies

0.2.3-1 / 2012-12-12
==================

- Fix for bad template processing; thanks to @sbrandwoo

0.2.3 / 2012-12-12
==================

- Adding support for Grunt *0.4.x* by using [underscore's templating engine](http://underscorejs.org/#template), rather than Grunt's version of it
- Updated JSLint to edition **2012-12-04**

0.2.2-1 / 2012-12-04
==================

- Updating JSLint to "edition" **2012-11-17**

0.2.2 / 2012-11-19
==================

- Adding option to not cause Grunt to fail if a violation is detected

0.2.1 / 2012-11-03
==================

- Added JSLint XML output for [Jenkins Violations Plugin](https://github.com/jenkinsci/violations-plugin)

0.2.0 / 2012-10-16
==================

- Cleaned up your `grunt.js` file for you - moved all options into the `jslint` object

0.1.8 / 2012-10-02
==================

- Updating README.md to contain more verbose documentation
- Adding keywords to package.json

0.1.7 / 2012-10-02
==================

- Added an option to only report on errors

0.1.6 / 2012-09-28
==================

- Added an exclude option
- Added number of files in violation to standard output
