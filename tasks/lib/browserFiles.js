var globby = require('globby');
var fs = require('fs');
var async = require('async');
var path = require('path');
var wiredep = require('wiredep');
var stripBom = require('strip-bom');

exports.get = function(opts, callback){
    async.parallel(getFileMethodFunctions(opts), function(err, result){
        if(err){
            callback(err, null);
        }
        else{
            var sourceFiles = createFilesObject();
            result.forEach(function(files){
                if(files.app){
                    if(files.app.js){
                        sourceFiles.app.js = sourceFiles.app.js.concat(files.app.js);
                    }
                    if(files.app.css){
                        sourceFiles.app.css = sourceFiles.app.css.concat(files.app.css);   
                    }
                }
                if(files.bower){
                    if(files.bower.js){
                        sourceFiles.bower.js = sourceFiles.bower.js.concat(files.bower.js);
                    }
                    if(files.bower.css){
                        sourceFiles.bower.css = sourceFiles.bower.css.concat(files.bower.css);   
                    }
                }
            });
            callback(null, sourceFiles);
        }
    });
};

function excludeFiles(exclude, files){
    if(exclude){
        return files.filter(function(file){
            return exclude.filter(function(excludeFile){
                return file.indexOf(excludeFile) > -1;
            }).length === 0;
        });
    }
    else{
        return files;
    }
};

function parseSlashes(files){
    return files.map(function(file){
        return file.replace(/\\/g, '/');
    });
};

function getFileMethodFunctions(opts){
    var methods = ["wiredep", "config", "glob", "files" ];
    function getMethodFunction(opts, getFileMethods){
        return function(method){
            return getFileMethods[method].bind(null, opts[method]);
        }
    };

    return methods.filter(function(method){
        return opts[method];
    }).map(function(method){
        return getMethodFunction(opts, getFileMethods)(method);
    });
};

var getFileMethods = {

    wiredep: function(opts, callback){
        function getRelativePath(file){
            return path.relative(process.cwd(), file);
        };
        opts.directory = opts.directory || 'bower_components';
        var bowerJson = opts.file ? require(path.join(process.cwd(), opts.file)) : require (path.join(process.cwd(), 'bower.json'));
        var bowerSourceFiles = wiredep({
            exclude: opts.exclude,
            directory: opts.directory,
            bowerJson: bowerJson
        });

        callback(null, {
            bower: {
                js: bowerSourceFiles.js ? parseSlashes(excludeFiles(opts.exclude, bowerSourceFiles.js.map(getRelativePath))) : [],
                css: bowerSourceFiles.css ? parseSlashes(excludeFiles(opts.exclude,bowerSourceFiles.css.map(getRelativePath))) : []
            }
        });
    },

    glob: function(opts, callback){
        var getAppJs = function(globPattern, callback){
            globby(globPattern, {}, function(err, files){
                if(err){
                    callback(err, null);
                }
                else{
                    callback(null, sort(files));
                }
            });
        };

        var asyncGetAppJsFunctions = [];
        function createAsyncGetAppJsFunction(directory){

            var globPattern = [];
            if(!opts.excludeJs){
                globPattern = [directory + "/**/*.js", "!" + directory + "/**/*spec.js"];
            }
            if(!opts.excludeCss){
                globPattern.push(directory + "/**/*.css");
            }
                
            addToAsyncGetAppJsFunctions(asyncGetAppJsFunctions, globPattern);
        };
        function addToAsyncGetAppJsFunctions(_asyncGetAppJsFunctions, globPattern){
            _asyncGetAppJsFunctions.push(getAppJs.bind(null, globPattern));
        };
        opts.directories.forEach(createAsyncGetAppJsFunction);

        var filterCss = function(file){
            return file.substr(-"css".length) === "css";
        };
        var filterJs = function(file){
            return file.substr(-"js".length) === "js";
        };

        async.parallel(asyncGetAppJsFunctions, function(err, result){
            if(err){
                callback(err, null);
            }
            else{
                var appSourceFiles = {
                    app:{
                        js:[],
                        css:[]
                    }
                };
                result.forEach(function(files){
                    appSourceFiles.app.js = parseSlashes(excludeFiles(opts.exclude, appSourceFiles.app.js.concat(files.filter(filterJs))));
                    appSourceFiles.app.css = parseSlashes(excludeFiles(opts.exclude, appSourceFiles.app.css.concat(files.filter(filterCss))));
                });

                callback(null, appSourceFiles);
            }
        });
    },

    config: function(opts, callback){
        fs.readFile(opts.file, function(err, data){
            if(err){
                callback(err, null);
            }
            else{
                var files = JSON.parse(stripBom(data));
                var sourceFiles = createFilesObject();
                sourceFiles.bower.js = files.bower && files.bower.js ? parseSlashes(excludeFiles(opts.exclude, files.bower.js)) : [];
                sourceFiles.bower.css = files.bower && files.bower.css ? parseSlashes(excludeFiles(opts.exclude,files.bower.css)) : [];
                sourceFiles.app.js = files.app && files.app.js ? parseSlashes(excludeFiles(opts.exclude,files.app.js)) : [];
                sourceFiles.app.css = files.app && files.app.css ? parseSlashes(excludeFiles(opts.exclude,files.app.css)) : [];
                callback(null, sourceFiles);
            }
        });
    },

    files: function(opts, callback){
        var sourceFiles = createFilesObject();
        sourceFiles.bower.js = opts.bower && opts.bower.js ? parseSlashes(excludeFiles(opts.exclude, opts.bower.js)) : [];
        sourceFiles.bower.css = opts.bower && opts.bower.css ? parseSlashes(excludeFiles(opts.exclude, opts.bower.css)) : [];
        sourceFiles.app.js = opts.app && opts.bower.js ? parseSlashes(excludeFiles(opts.exclude, opts.app.js)) : [];
        sourceFiles.app.css = opts.app && opts.bower.css ? parseSlashes(excludeFiles(opts.exclude, opts.app.css)) : [];
        callback(null, sourceFiles);
    }
};

function createFilesObject(){
    return {
        bower:{
            js:[],
            css:[]
        },
        app:{
            js:[],
            css:[]
        }
    };
};

var directoryLevel = function(string){
    return (path.normalize(string).match(/\\/g) || []).length;
}

var sort = function(array){
    var comparer = function(a,b){
        var level = directoryLevel(a) - directoryLevel(b);
        if(level !== 0){
            return level;
        } 
        return a.toLowerCase().localeCompare(b.toLowerCase());
    };
    return array.sort(comparer);
};

exports.sort = sort;