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

exports.surround = {
  surr_1: function(test) {
    test.expect(2);

    test.ok(
      grunt.file.exists('tmp/surround-1.js'),
      'Destination file should exists'
    );

    var result = grunt.file.read('tmp/surround-1.js'),
        expected = grunt.file.read('test/expected/surround-1.js');

    test.equal(
      result,
      expected,
      'Content of the generated file should match the expected value.'
    );

    test.done();
  },
  surr_2: function(test) {
    test.expect(2);

    test.ok(
      grunt.file.exists('tmp/surround-2.js'),
      'Destination file should exists'
    );

    var result = grunt.file.read('tmp/surround-2.js'),
        expected = grunt.file.read('test/expected/surround-2.js');

    test.equal(
      result,
      expected,
      'Content of the generated file should match the expected value.'
    );

    test.done();
  },
  surr_3: function(test) {
      test.expect(2);

      test.ok(
        grunt.file.exists('tmp/surround-3.js'),
        'Destination file should exists'
      );

      var result = grunt.file.read('tmp/surround-3.js'),
          expected = grunt.file.read('test/expected/surround-3.js');

      test.equal(
        result,
        expected,
        'Content of the generated file should match the expected value.'
      );

      test.done();
  }
};
