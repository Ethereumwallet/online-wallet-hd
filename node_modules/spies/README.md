# spies

Spy on a running node program by having a man on the inside

	npm install spies

The first thing you need is to setup a spy inside your program

``` js
var spies = require('spies');
var net = require('net');

net.createServer(function(socket) {
	var spy = spies();

	spy.on('echo', function() {
		spy.log(Array.prototype.slice.call(arguments));
	});
	spy.on('load-avg', function() {
		spy.log(require('os').loadavg());
	});

	socket.pipe(spy).pipe(socket);
}).listen(9999);
```

As you can see `spy` is simply a readable and writable stream so you can pipe to any kind of stream transport (like a websocket)

You can use the `spies.listen` helper if you just want to listen using a tcp server

``` js
spies.listen(9999, function(spy) {
	// attach commands here
});
```

Afterwards you can use `netcat` to contact and debrief your spy

	nc localhost 9999

This starts a `repl` where you can type in commands

	help
	$ : help
	  : watch
	  : echo
	  : load-avg

`help` and `watch` are build in commands than print the help and runs the same command every 1 second.
You invoke a command simply typing it and pressing `enter` and the result will be pretty printed below.

	load-avg
	$ : 0.30126953125
	  : 0.3203125
	  : 0.33642578125

To pass arguments to the commands simply seperate them them by a `space`

	echo hello
	$ : hello