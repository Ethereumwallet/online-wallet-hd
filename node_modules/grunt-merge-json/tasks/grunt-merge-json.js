/*
**  grunt-merge-json -- Grunt Task for Merging Multiple JSON Files
**  Copyright (c) 2013-2014 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module: false */
module.exports = function (grunt) {
    /* global require: false */
    var chalk = require("chalk");
    var _ = require("lodash");

    grunt.registerMultiTask("merge-json", "Merge Multiple JSON Files", function () {
        /*  prepare options  */
        var options = this.options({
            replacer: null,
            space: "\t"
        });
        grunt.verbose.writeflags(options, "Options");

        /*  iterate over all src-dest file pairs  */
        this.files.forEach(function (f) {
            try {
                /*  start with an empty object  */
                var json = {};
                f.src.forEach(function (src) {
                    /*  merge JSON file into object  */
                    if (!grunt.file.exists(src))
                        throw "JSON source file \"" + chalk.red(src) + "\" not found.";
                    else {
                        var fragment;
                        grunt.log.debug("reading JSON source file \"" + chalk.green(src) + "\"");
                        try { fragment = grunt.file.readJSON(src); }
                        catch (e) { grunt.fail.warn(e); }
                        json = _.merge(json, fragment, function (a, b) {
                            return _.isArray(a) ? a.concat(b) : undefined;
                        });
                    }
                });

                /*  write object as new JSON  */
                grunt.log.debug("writing JSON destination file \"" + chalk.green(f.dest) + "\"");
                grunt.file.write(f.dest, JSON.stringify(json, options.replacer, options.space));
                grunt.log.writeln("File \"" + chalk.green(f.dest) + "\" created.");
            }
            catch (e) {
                grunt.fail.warn(e);
            }
        });
    });
};

