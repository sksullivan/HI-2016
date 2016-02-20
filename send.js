var exec = require('child_process').exec;
var command = "irsend";

exports.list = function(remote, code, callback){
	if (!remote) remote = '';
  	if (!code) code = '';

  	var sendComm = command + ' LIST "' + remote + '" "' + code + '"';
  	console.log(sendComm)
  	return exec(sendComm, callback);
}