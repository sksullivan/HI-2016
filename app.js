#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    url  = 'http://localhost:' + port + '/',
    send = require('./send.js');

var remotesAndCommands = {};

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
var timeoutData = {};
io.on('connection', function(socket){
    
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    //socket.emit('availableRemotes', remotesAndCommands);
    socket.emit('availableRemotes', {'remotes':['1','2']});

    socket.on('singleButtonPress', function(msg){
      console.log(msg)
      send.sendOnce(msg.remote, msg.code, function(err, stdout, stderr){
        if(err == null){
          socket.emit(200);
          console.log('pressed: '+msg.remote+' '+msg.code);
        }
        else {
          socket.emit(500);
        }
      });
    });

    socket.on('startButtonPress', function(msg){
      console.log('start')
      send.sendStart(msg.remote, msg.code, function(err, stdout, stderr){
        if(err == null){
          socket.emit(200);
          console.log('holding: '+msg.remote+' '+msg.code);
        }
        else {
          socket.emit(500);
        }
      });
    });

    socket.on('stopButtonPress', function(msg){
      console.log('stop');
      send.sendStop(msg.remote, msg.code, function(err, stdout, stderr){
        if(err == null){
          socket.emit(200);
          console.log('let go of: '+msg.remote+' '+msg.code);
        }
        else {
          socket.emit(500);
        }
      });
    });

    socket.on('startSleepTimer', function(msg){
      timeoutData[msg.remote] = setTimeout(sleepTimer,msg.duration*1000,msg.remote);
    });

    socket.on('cancelSleepTimer', function(msg){
      clearTimeout(timeoutData[msg.remote]);
      timeoutData[msg.remote] = null;
    });
});

var sleepTimer = function(remoteName){
  send.sendOnce(remoteName, "KEY_POWER", function(err, stdout, stderr){
        if(err == null){
          socket.emit(200);
          console.log('sleepy time');
        }
        else {
          socket.emit(500);
        }
    });
}
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
            commands.forEach(function(element, index){
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
getRemotesAndCommands();
