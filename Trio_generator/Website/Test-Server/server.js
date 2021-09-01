"use strict";
var http = require('http');
var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var server_port = process.env.PORT || 4477;
var url = require('url');
var fs = require('fs');
var pages = ["trio"];
function fserverhandler(req, res) {
    var path = url.parse(req.url).pathname;

    if (path != '') {
        let tmp = path.split('');
        tmp = tmp.slice(1, path.length);
        path = tmp.join('');
    }

    if (path == '' || path == 'html') {
        path = pages[0] + '.html';
    }

    if (pages.includes(path)) {
        path += ".html";
    }
    var used = false;

    if (path.indexOf('.html') != -1 && !used) {
        used = true;
        if (pages.includes(path.substring(0, path.length - 5)) || pages.includes(path)) {
            let pageset = false;
            for (var i = 0; i < pages.length; i++) {
                let page = pages[i];
                if (page == path || page + '.html' == path) {
                    if (!pageset) {
                        pageset = true;
                        fs.readFile(__dirname + '/../' + page + '.html', function (error, data) {
                            if (error) console.error(error);
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            res.write(data);
                            res.end();
                        });
                    }
                }
            }
        } else {
            used = true;
            res.writeHead(404);
            res.write("opps this doesn't exist - 404");
            res.end();
        }
    }

    if (req.url.indexOf('.js') != -1 && !used) { //req.url has the pathname, check if it conatins '.js'
        used = true;
        fs.readFile(__dirname + '/../' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
        });
    }

    if (req.url.indexOf('.css') != -1 && !used) { //req.url has the pathname, check if it conatins '.css'
        used = true;
        fs.readFile(__dirname + '/../' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    }

    if (!used) {
        res.writeHead(404);
        res.write("opps this doesn't exist - 404");
        res.end();
    }
}

var server = http.createServer(fserverhandler);
server.listen(server_port, ip);
console.log("Server is listening on " + ip + ":" + server_port);