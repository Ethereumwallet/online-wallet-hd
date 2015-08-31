/*
 * grunt-wraps
 * https://github.com/mario/grunt-wraps
 *
 * Copyright (c) 2013 Mario Bartlack
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
          'Gruntfile.js',
          'tasks/*.js',
          'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tmp: ['tmp']
    },

    // Configuration to be run (and then tested).
    surround: {
      options: {
        prepend: ';(function(){',
        append: '})();'
      },
      surr_1: {
        files: [{
          src: 'test/fixtures/surround-1.js',
          dest: 'tmp/surround-1.js'
        }]
      },
      surr_2: {
        options: {
          linefeed: '',
          prepend: function() {return ';(function(){';},
          append: function() {return '})();';}
        },
        files: [{
          src: 'test/fixtures/surround-2.js',
          dest: 'tmp/surround-2.js'
        }]
      },
      surr_3: {
        options: {
          ignoreRecurrence: true,
          linefeed: ''
        },
        files: [{
          src: 'test/fixtures/surround-3.js',
          dest: 'tmp/surround-3.js'
        }]
      },
      surr_4: {
        files: [{
          src: 'test/fixtures/surround-1.js'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      test: ['test/surround-test.js']
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
  grunt.registerTask('test', ['jshint', 'clean', 'surround', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'clean', 'surround']);

};
