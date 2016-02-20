#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    url  = 'http://localhost:' + port + '/',
    send = require('./send.js');

var remotes = [];

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
io.on('connection', function(socket){
    getRemotes();
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    
    socket.emit('availableRemotes', remotes);
});

var getRemotes = function(){
  send.list(null,null, function(err, stdout, stderr){
      var remotes = stderr.split('\n');
      console.log('remotes: '+remotes);
      remotes.forEach(function(element, index, array){
        var name = element.match(/\s(.*)$/);
        console.log(name);
      })
    });
}