grunt-rename-assets
===================

Rename asset files with their MD5/SHA1 hashes.

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-rename-assets --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-rename-assets');
```

## Options

### skipIfHashed

Type: `Boolean`   Default: `true`

Skip if file name already contains the hash.

### algorithm

Type: `String`    Default: `sha1`

Can be `md5`, `sha1`, `sha256`, etc.
See [possible algorithms](http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm).

### format

Type: `String`    Default: `{{basename}}-{{hash}}{{ext&&("."+ext)}}`

Format for the new file name. You can use these variables:

* global: process, require, console, grunt
* file:   hash, basename, ext, realpath

### inject

Type: `Object`    Default: `{}`

Add more variables to use in `format`. Keys are the variable names.

### startSymbol

Type: `String`    Default: `{{`

### endSymbol

Type: `String`    Default: `}}`

### callback

Type: `Function`  Default: `function() {}`

The callback function gets two arguments `(befores, afters)` where `befores` and
`afters` are the list of old and new file names respectively. You can use `this`
to access the current Grunt task.

## Example

```js
grunt.initConfig({
  rename: {
    assets: {
      options: {
        skipIfHashed: true,
        startSymbol: '{{',
        endSymbol: '}}',
        algorithm: 'sha1',
        format: '{{timestamp()}}-{{basename}}-{{hash}}-{{require("fs").statSync(realpath).size}}.{{ext}}',
        inject: {
          timestamp: function() {
            return +new Date;
          }
        },
        callback: function(befores, afters) {
          var publicdir = require('fs').realpathSync('public');
          var path = require('path');
          var index = grunt.file.read('public/index.html'), before, after;
          for (var i = 0; i < befores.length; i++) {
            before = path.relative(publicdir, befores[i]);
            after = path.relative(publicdir, afters[i]);
            index = index.replace(before, after);
          }
          grunt.file.write('public/index.html', index);
        }
      },
      files: [
        { src: [ 'public/css/*.css', 'public/js/*.js' ] }
      ]
    }
  }
});
```

## Developer

* caiguanhao &lt;caiguanhao@gmail.com&gt;
