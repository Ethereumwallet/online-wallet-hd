module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compileJoined:
        options:
          join: true
        files:
          'password-entropy.js':
            [
              'src/password-entropy.coffee'
            ]
    uglify:
      compileJoined:
        options:
          mangle: true
        files:
          'password-entropy.min.js':
            [
              'password-entropy.js'
            ]      
    watch:
      files: 'src/password-entropy.coffee'
      tasks:
        [
          'coffee'
          'uglify'
#         'other-task'
        ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default','Compile and minify coffeescript files', ['coffee', 'uglify']