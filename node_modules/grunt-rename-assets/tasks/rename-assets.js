var fs     = require('fs');
var path   = require('path');
var crypto = require('crypto');

var DEF_ALG   = 'sha1';
var DEF_FMT   = '{{basename}}-{{hash}}{{ext&&("."+ext)}}';
var DEF_SYM_S = '{{';
var DEF_SYM_E = '}}';
var DEF_NOOP  = function() {};

function isFunction(what) {
  return Object.prototype.toString.call(what) === '[object Function]';
}

function isString(what) {
  return Object.prototype.toString.call(what) === '[object String]';
}

function isObject(what) {
  return Object.prototype.toString.call(what) === '[object Object]';
}

function parse(text, bundle) {
  var keys = Object.keys(bundle);
  var args = '"' + keys.join('", "') + '"';
  var exp  = JSON.stringify('return ' + text + ';');
  var func = new Function('return new Function(' + args + ', ' + exp + ');')();
  return func.apply(undefined, keys.map(function(key) { return bundle[key]; }));
}

// from AngularJS
function interpolate(startSymbol, endSymbol, text, bundle) {
  var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length;
  var index = 0, parts = [], length = text.length;
  while(index < length) {
    if ( ((startIndex = text.indexOf(startSymbol, index)) != -1) &&
         ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) ) {
      (index != startIndex) && parts.push(text.substring(index, startIndex));
      parts.push(parse(text.substring(startIndex + startSymbolLength, endIndex), bundle));
      index = endIndex + endSymbolLength;
    } else {
      (index != length) && parts.push(text.substring(index));
      index = length;
    }
  }
  var ret = parts.join('').replace(/[\r\n\t]+/g, '');
  return ret;
}

module.exports = function(grunt) {

  grunt.registerMultiTask(
    'rename',
    'Rename asset files with their MD5/SHA1 hashes',
    function() {

    var files        = this.files;
    var options      = this.options();

    var algorithm    = options.algorithm;
    var format       = options.format;
    var startSymbol  = options.startSymbol;
    var endSymbol    = options.endSymbol;
    var skipIfHashed = options.skipIfHashed === false ? false : true;
    var callback     = options.callback;
    var inject       = options.inject;
    var befores      = [];
    var afters       = [];

    if (!isString(algorithm)   || !algorithm)   algorithm   = DEF_ALG;
    if (!isString(format)      || !format)      format      = DEF_FMT;
    if (!isString(startSymbol) || !startSymbol) startSymbol = DEF_SYM_S;
    if (!isString(endSymbol)   || !endSymbol)   endSymbol   = DEF_SYM_E;
    if (!isFunction(callback))                  callback    = DEF_NOOP;
    if (!isObject(inject))                      inject      = {};

    for (var i = 0; i < files.length; i++) {
      for (var j = 0; j < files[i].src.length; j++) {
        var realpath = fs.realpathSync(files[i].src[j]);
        var content  = grunt.file.read(realpath);
        var shasum   = crypto.createHash(algorithm);
                       shasum.update(content);
        var hash     = shasum.digest('hex');

        var dirname  = path.dirname(realpath);
        var filename = path.basename(realpath);
        var dot      = filename.indexOf('.');
        var basename = filename.slice(0, dot > -1 ? dot : undefined);
        var ext      = dot > -1 ? filename.slice(dot + 1) : '';

        if (skipIfHashed && filename.indexOf(hash) > -1) continue;

        var bundle = {
          ext:      ext,
          hash:     hash,
          basename: basename,
          realpath: realpath,

          process:  process,
          require:  require,
          console:  console,
          grunt:    grunt
        };

        for (var inj in inject) {
          bundle[inj] = inject[inj];
        }

        var newFileName;
        try {
          newFileName = interpolate(startSymbol, endSymbol, format, bundle);
        } catch(e) {
          console.error(('Error parsing: ' + format).red);
          grunt.fail.fatal(e.stack);
        }

        if (filename === newFileName) continue;
        try {
          var oldpath = path.join(dirname, filename);
          var newpath = path.join(dirname, newFileName);
          fs.renameSync(oldpath, newpath);
          befores.push(oldpath);
          afters.push(newpath);
        } catch(e) {
          console.error(('Error renaming file from ' + filename + ' to ' + newFileName).red);
          grunt.fail.fatal(e.stack);
        }

        grunt.log.ok(filename.cyan + ' → ' + newFileName.cyan);
      }
    }

    callback.call(this, befores, afters);

    if (afters.length === 0) {
      grunt.log.ok('No asset files to rename.');
    }

  });

};
