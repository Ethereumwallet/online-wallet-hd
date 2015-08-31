var Stream = require('stream');
var format = require('./format');

var noop = function() {};

var Spy = function(options) {
	options = options || {};

	this.buffer = '';
	this.once('pipe', function(stream) {
		stream.on('error', noop); // ignore errors yo
		if (!stream.setEncoding) return;
		stream.setEncoding('utf-8');
	});

	this.tty = options.tty !== false;
	this.prev = null;
	this.readable = true;
	this.writable = true;

	Stream.call(this);
};

Spy.prototype.__proto__ = Stream.prototype;

Spy.prototype.write = function(data) {
	var self = this;
	var messages = (this.buffer+data).split('\n');
	this.buffer = messages.pop();
	messages.forEach(function(message) {
		if (!message.trim()) return self.emit('help');
		if (!self.readable) return;
		message = message.split(/\s+/g).map(function(item) {
			if (/^\d+$/.test(item)) return parseInt(item, 10);
			return item;
		});
		message = message[0] === '-' ? self.prev : message;
		self.emit.apply(self, message);
		self.prev = message;
	});
};

Spy.prototype.end = function() {
	this.finish(true);
};

Spy.prototype.destroy = function() {
	this.finish();
};

Spy.prototype.finish = function(ended) {
	if (!this.readable) return;
	this.readable = false;
	this.writable = false;
	if (ended) {
		this.emit('end');
	}
	this.emit('close');
};

Spy.prototype.log = function(value) {
	this.emit('data', format(value, this.tty));
};

var spies = function(options) {
	var sh = new Spy(options);
	var cmds = [];

	sh.on('newListener', function(name) {
		if (name in {data:1,close:1,end:1,drain:1,error:1}) return;
		cmds.push(name);
	});
	sh.on('help', function() {
		sh.log(cmds);
	});

	return sh;
};

spies.listen = function(port, onspy) {
	if (typeof port === 'function') {
		var server = spies.listen(10101, port);
		server.once('error', function(err) {
			server.listen(0);
		});
		return server;
	}
	return require('net').createServer(function(socket) {
		var spy = spies();
		socket.pipe(spy).pipe(socket);
		onspy(spy);
	}).listen(port);
};

module.exports = spies;