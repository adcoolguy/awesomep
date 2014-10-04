/* jshint node:true */

/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
//  cache = require('./routes/cache'),
    http = require('http'),
    path = require('path');
var app = express();

var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var mime = require('mime');

var root = __dirname;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get("/cache/:key", cache.getCache);
//app.put("/cache", cache.putCache);
//app.delete("/cache/:key", cache.removeCache);

var server = http.createServer(function (req, res) {
//    res.writeHead(200);
//    res.end('Hello, World!\n');
    var url = parse(req.url);
    var path = join(root, url.pathname);
//    var stream = fs.createReadStream(path);
//    stream.pipe(res);
    fs.stat(path, function(err, stat) {
        if(err) {
            if('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                res.statusCode = 500;
                res.end('Internal server error');
            }
        } else {
            res.setHeader("Content-Type", mime.lookup(path)); //handle .js content type
            res.setHeader('Content-Length', stat.size);
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function(err) {
                res.statusCode = 500;
                res.end('Internal server error');
            });
        }
    });
});
server.listen(app.get('port'));
console.log('NodeJS server listening on port ' + app.get('port') + " (build 100 r11)");

//var server = http.createServer(function () {
//  	console.log('Express server listening on port ' + app.get('port') + " (build 100 r7)");
//});
//server.listen(app.get('port'));