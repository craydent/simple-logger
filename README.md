# simple-logger
logging mechanism for file system with event listeners/callbacks

var test = new (require('./simple-logger'))(["/var/log/system.log"]);
test.on('access_error', function (err) {
	console.log(err);
});
test.addFiles(["/var/log/system.log"]);