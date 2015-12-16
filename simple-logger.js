var EventEmitter = require('events').EventEmitter, 
	util = require('util');

function simpleLogger(/*proc, logFiles OR logFiles*/) {
	var proc = process, logFiles = arguments[0], self = this;
	if (arguments.length == 2) {
		proc = arguments[0];
		logFiles = arguments[1];
	} else if (arguments.length == 1 && arguments[0].constructor != Array && arguments[0].constructor != String) {
		logFiles = undefined;
		proc = arguments[0];
	}
	self.proc = proc;
	self.err = proc.stderr;
	self.out = proc.stdout;
	self.addFiles = addFiles.bind(self);

	logFiles && self.addFiles(logFiles);

	//return self;
}
function addFiles (options) {
	var self = this,
		proc = self.proc,
		logFiles = options,
		pipes = {stderr:1,stdout:1},
		fs = require('fs'),
		failedLogs = [];
	if (options.constructor == Object) {
		logFiles = options.files;
		pipes = options.pipes || pipes;
	}
	if (logFiles.constructor == String) {
		logFiles = [logFiles];
	}

	// retrieve file permissions to the syslog and check permissions
	for (var i = 0, len = logFiles.length; i < len; i++) {
		if (!logFiles[i]) { continue; }
		try { fs.accessSync (logFiles[i], fs.W_OK);} catch(e){ self.emit('access_error', {err: e, file:logFiles[i]}); continue; }

		var logfile = !noAccessTolog && fs.createWriteStream(logFiles[i]);

		if (logfile) {
			pipes.stdout && proc.stdout.pipe(logfile);
			pipes.stderr && proc.stderr.pipe(logfile);
		}
	}
}
util.inherits(simpleLogger, EventEmitter);
module.exports = simpleLogger;