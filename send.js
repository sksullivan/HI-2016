var exec = require('child_process').exec;
var command = "irsend";

exports.list = function(remote, code, callback){
	if (!remote) remote = '';
  	if (!code) code = '';

  	var sendComm = command + ' LIST "' + remote + '" "' + code + '"';
  	return exec(sendComm, callback);
};

exports.sendOnce = function(remote, code, callback){
	if (!remote) remote = '';
  	if (!code) code = '';

  	var sendComm = command + ' SEND_ONCE "' + remote + '" "' + code + '"';
  	return exec(sendComm, callback);
};

exports.sendStart = function(remote, code, callback){
	if (!remote) remote = '';
  	if (!code) code = '';

  	var sendComm = command + ' SEND_START "' + remote + '" "' + code + '"';
  	return exec(sendComm, callback);
};

exports.sendStop = function(remote, code, callback){
	if (!remote) remote = '';
  	if (!code) code = '';

  	var sendComm = command + ' SEND_STOP "' + remote + '" "' + code + '"';
  	return exec(sendComm, callback);
};