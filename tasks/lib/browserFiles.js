var globby = require('globby');
var fs = require('fs');
var async = require('async');
var path = require('path');
var wiredep = require('wiredep');

exports.get = function(opts, callback){
    var asyncGetAppJsFunctions = [];
    if(opts.appDirectories){
        for(var i = 0, length = opts.appDirectories.length; i < length; i++){
            var globPattern = [opts.appDirectories[i] + "/**/*.js", "!" + opts.appDirectories[i] + "/**/*spec.js"];
            asyncGetAppJsFunctions[i] = getAppJs.bind(null, globPattern);
        }
    }

    async.parallel(asyncGetAppJsFunctions, function(err, result){
        if(err){
            callback(err, null);
        }
        else{
            var js = {};
            var bowerJson = opts.bowerFile ? require(path.join(process.cwd(), opts.bowerFile)) : require (path.join(process.cwd(), 'bower.json'));

            js.bower = wiredep({
                exclude: opts.bowerExclude,
                directory: opts.bowerDirectory,
                bowerJson: bowerJson
            }).js.map(function(file){
                return path.relative(process.cwd(), file);
            });

            for(var i = 0, length = result.length; i < length; i++){
                js.app = js.app ? js.app.concat(result[i]) : result[i];
            }
            callback(null, js);
        }
    });
};

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

var directoryLevel = function(string){
    return (path.normalize(string).match(/\\/g) || []).length;
}

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
