var exec = require('child_process').exec;

exports = module.exports = send;

var command = "irsend";

exports.list = function(remote, code, callback){
	if (!remote) remote = '';
  	if (!code) code = '';

  	var sendComm = this.command + ' LIST "' + remote + '" "' + code + '"';
  	return exec(sendComm, callback);
}