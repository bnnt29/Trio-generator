"use strict";
var http = require('http');
var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var server_port = process.env.PORT || 4477;
var url = require('url');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path == '' || path == '/') {
        path = '/index.html';
    }
    switch (path) {
        case '/':
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.write("This is Test Message!");
            res.end();
            break;
        case '/index.html':
            fs.readFile(__dirname + path, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write(error);
                    res.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write(data);
                    res.end();
                }
            });
            break;
        default:
            res.writeHead(404);
            res.write("opps this doesn't exist - 404");
            res.end();
            break;
    }
});
server.listen(server_port, ip);
console.log("Server is listening on " + ip + ":" + server_port);