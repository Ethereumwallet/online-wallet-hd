module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: [
				'Gruntfile.js',
				'src/*.js',
				'test/*.js',
			],
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true,
					module: true,
					document: true
				}
			}
		},

		connect: {
			server: {
				options: {
					port: 8888,
					base: '.'
				}
			}
		},

		casper: {
      test: {
        options: {
          test: true
        },
        src: ['test/*.js']
      },
      test2: {
        options: {
          test: true
        },
        src: ['test/browser.js']
      }
    }

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('test', [
		'jshint',
		'connect',
		'casper'
	]);

	grunt.registerTask('default', [
		'test'
	]);

};