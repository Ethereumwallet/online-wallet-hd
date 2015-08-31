/*
 * grunt-wraps
 * https://github.com/mario/grunt-wraps
 *
 * Copyright (c) 2013 Mario Bartlack
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore.string');

module.exports = function (grunt) {

  function isFunction(value) {
    return typeof value === 'function';
  }

  function isString(value) {
    return typeof value === 'string';
  }

  grunt.registerMultiTask(
    'surround',
    'Surround the content of a file with another content.',
    function () {

      var opts = this.options({
          prepend: '',
          append: '',
          overwrite: false,
          linefeed: grunt.util.linefeed,
          ignoreRecurrence: false
        }),
        prepend = isFunction(opts.prepend) ? opts.prepend() : opts.prepend,
        append = isFunction(opts.append) ? opts.append() : opts.append;

      this.files.forEach(function (f) {

        var file = f.src[0],
          content = grunt.file.read(file);

        if (opts.ignoreRecurrence) {
          if (_.startsWith(content, prepend)) {
            prepend = '';
          }

          if (_.endsWith(content, append)) {
            append = '';
          }
        }

        if (!opts.overwrite && !f.dest) {
          grunt.log.writeln(
            'The option "overwrite" is set but no destination file is defined.'
          );
          return;
        }

        grunt.file.write(
          opts.overwrite ? file : f.dest,
          [prepend, opts.linefeed, content, opts.linefeed, append].join('')
        );
      });
    }
  );
};
