# Karma configuration
# Generated on Thu Mar 05 2015 10:56:28 GMT+0000 (GMT)

module.exports = (config) ->
  config.set

    # base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: ''


    # frameworks to use
    # available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine']

    plugins : [
      # 'karma-chrome-launcher'
      'karma-jasmine'
      'karma-coffee-preprocessor'
      'karma-phantomjs-launcher'   
    ]

    # list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.min.js'
      'node_modules/angular-mocks/angular-mocks.js'
      'password-entropy.min.js'
      'test/**/*Spec.coffee'
    ]

    # list of files to exclude
    exclude: [
    ]

    # preprocess matching files before serving them to the browser
    # available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '**/*.coffee': ['coffee']
    }

    coffeePreprocessor: {
      # options passed to the coffee compiler
      options: {
        bare: true,
        sourceMap: true
      },
      # transforming the filenames
      transformPath: (path) -> path.replace(/\.coffee$/, '.js')
    },

    # test results reporter to use
    # possible values: 'dots', 'progress'
    # available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress']


    # web server port
    port: 9876


    # enable / disable colors in the output (reporters and logs)
    colors: true


    # level of logging
    # possible values:
    # - config.LOG_DISABLE
    # - config.LOG_ERROR
    # - config.LOG_WARN
    # - config.LOG_INFO
    # - config.LOG_DEBUG
    logLevel: config.LOG_INFO


    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true


    # start these browsers
    # available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS'
      # 'Chrome'
    ]


    # Continuous Integration mode
    # if true, Karma captures browsers, runs the tests and exits
    singleRun: false
