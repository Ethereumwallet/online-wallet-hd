# grunt-surround

> Surround the content of a file with another content.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-surround --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-surround');
```

## The "surround" task

### Overview
In your project's Gruntfile, add a section named `surround` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  surround: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.prepend
Type: `String`
Default value: '' (empty String)

A string value that is prepended to the content.

#### options.append
Type: `String`
Default value: '' (empty String)

A string value that is appended to the content.

#### options.overwrite
Type: `Boolean`
Default value: false

Set this option to true to overwrite the source file instead of the destination file.
Note: If you set this option to true, there is no need to specify a destination file.

#### options.linefeed
Type: `String`
Default value: `grunt.util.linefeed`

The value for the linefeed.

#### options.ignoreRepetition
Type: `Boolean`
Default value: false

Set this option to true to check if your content already starts or ends with the specified 'prepend' or 'append' option.
If a match is found, your content will not be modified to avoid repetitions.

### Usage Examples

```js
grunt.initConfig({
  wraps: {
    options: {
      prepend: ';(function() {',
      append: '})()'
    },
    files: [{
      src: 'src/source.js',
      dest: 'dest/destination.js'
    }]
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
