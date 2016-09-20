<img src="http://craydent.com/JsonObjectEditor/img/svgs/craydent-logo.svg" width=75 height=75/>

# The Simple Logger 0.3.0
**by Clark Inada**

This module is a logging mechanism for file system with event listeners.

## Usages
The Simple Logger can take up to 2 arguments and will emit to error and access_error events 

* process - context for this instance (default is the current process).
* log_files - String or String\[\] of file paths.

###Overloads are as follows:
```js
new SimpleLogger("file/path");
new SimpleLogger(["file/path","file/path2"]);
new SimpleLogger({file:"file/path",options}); // **
new SimpleLogger([{file:"file/path",options},"file/path2"]); // **
new SimpleLogger(process);
new SimpleLogger(process, "file/path");
new SimpleLogger(process, ["file/path","file/path2"]);
new SimpleLogger(process, {file:"file/path",options}); // **
new SimpleLogger(process, [{file:"file/path",options},"file/path2"]); // **
```
** options is equivalient to [fs.createWriteStream](https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options) options

###Methods
The Simple Logger has 2 methods

* addFiles - this method allows you to add files after instantiation. Returns a Promise and overloads as follows:
    * addFiles("file/path");
    * addFiles(\["file/path","file/path2"\]);
    * addFiles({file:"file/path",options});
    * addFiles(\[{file:"file/path",options},"file/path2"\]);
    * addFiles(options);
        * options can have any of the following properties:
            * files - String or String\[\] of file paths or Object or Object\[\] (following the pattern above).
            * pipes - Object with properties stderr and stdout. These are boolean (truthy/falsy) flags indicating whether to pipe these streams.
* setProcess - this method allows you to change the process context after instantiation

```js
var SimpleLogger = require('simple-logger');
var logger = new SimpleLogger();
test.on('access_error', function (err) {
	// logic here
});
test.on('error', function (err) {
	// logic here
});
test.addFiles("/var/log/system2.log");
```

```js
var SimpleLogger = require('simple-logger');
var logger = new SimpleLogger("/var/log/system.log");
test.on('access_error', function (err) {
	// logic here
});
test.on('error', function (err) {
	// logic here
});
```

```js
var SimpleLogger = require('simple-logger');
var logger = new SimpleLogger(["/var/log/system.log"]);
test.on('access_error', function (err) {
	// logic here
});
test.on('error', function (err) {
	// logic here
});
```


## Installation

```shell
$ npm i --save the-simple-logger
```


## Download

 * [GitHub](https://github.com/craydent/simple-logger)
 * [BitBucket](https://bitbucket.org/craydent/simple-logger)

The Simple Logger is released under the [Dual licensed under the MIT or GPL Version 2 licenses](http://craydent.com/license).<br>



