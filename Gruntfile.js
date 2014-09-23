module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    uglify: {
      options: {
        mangle: false
      },
      target: {
        files: {
          'dist/json_query.min.js': ['json_query.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Build task
  grunt.registerTask('default', ['uglify']);
};
