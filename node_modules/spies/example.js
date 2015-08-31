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