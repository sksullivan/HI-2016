#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    url  = 'http://localhost:' + port + '/',
    send = require('./send.js');

var remotesAndCommands = [];

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
io.on('connection', function(socket){
    getRemotesAndCommands();
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.emit('availableRemotes', remotesAndCommands);
});

var getRemotesAndCommands = function(){
  send.list(null,null, function(err, stdout, stderr){
      var remotes = stderr.split('\n');
      remotes.forEach(function(element, index, array){
        var remoteName = element.match(/\s(.*)$/);
        if(remoteName){
          remoteName = remoteName[1];
          remotesAndCommands[remoteName] = [];
          send.list(remoteName,null, function(err, stdout, stderr){
            var commands = stderr.split('\n');
            commands.forEach(function(element, index, array){
              var commandName = element.match(/\s.*\s(.*)$/);
              if(commandName && commandName[1]){
                remotesAndCommands[remoteName].push(commandName[1]);
              }
            });
          });
        }
      });
    });
}