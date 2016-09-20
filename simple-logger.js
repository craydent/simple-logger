/*/---------------------------------------------------------/*/
/*/ Craydent LLC the-simple-logger-v0.3.0                   /*/
/*/ Copyright 2011 (http://craydent.com/about)              /*/
/*/ Dual licensed under the MIT or GPL Version 2 licenses.  /*/
/*/ (http://craydent.com/license)                           /*/
/*/---------------------------------------------------------/*/
var EventEmitter = require('events').EventEmitter, 
	util = require('util'),
	fs = require('fs'),
	$c = require('craydent/noConflict'),
	fsaccess = $c.yieldable(fs.access,fs);

function SimpleLogger(/*proc, logFiles OR logFiles*/) {
	var proc = process, logFiles = arguments[0], self = this;
	if (arguments.length == 2) {
		proc = arguments[0];
		logFiles = arguments[1];
	} else if (arguments[0] && arguments.length === 1 && arguments[0].stdout) {
		logFiles = undefined;
		proc = arguments[0];
	}
	self.proc = proc;
	self.err = proc.stderr;
	self.out = proc.stdout;
	self.addFiles = addFiles.bind(self);
	self.hasListeners = addFiles.bind(self);

	logFiles && self.addFiles(logFiles);
	self.setProcess = function (proc){ self.proc = proc; };

}
function hasListeners (ev) { return !!this.listeners(ev).length; }
function addFiles (options) {
	return $c.syncroit(function *() {
		var self = this,
			proc = self.proc,
			logFiles = options,
			pipes = {stderr: 1, stdout: 1};

		if ($c.isObject(options) && options.files) {
			logFiles = options.files;
			pipes = options.pipes || pipes;
		}
		if (!$c.isArray(logFiles) && $c.isString(logFiles)) {
			logFiles = [logFiles];
		} else if (self.hasListeners('error')) {
			self.emit('error', new Error('log file argument must be either an array or string'));
		}

		// retrieve file permissions to the syslog and check permissions
		for (var i = 0, len = logFiles.length; i < len; i++) {
			var logFile = logFiles[i], foptions, stream;
			if (!logFile) { continue; }
			if ($c.isObject(logFile)) {
				foptions = logFile.options;
				logFile = logFile.file;
			}
			try {
				yield fsaccess(logFile, fs.W_OK);
			} catch (e) {
				self.emit('access_error', {err: e, file: logFile});
				continue;
			}

			stream = fs.createWriteStream(logFile, foptions);

			if (stream) {
				pipes.stdout && proc.stdout.pipe(stream);
				pipes.stderr && proc.stderr.pipe(stream);
			}
		}
	});
}
util.inherits(SimpleLogger, EventEmitter);
module.exports = SimpleLogger;