var format = function(obj, tty) {
	var res = [];

	var color = function(col, str) {
		if (!tty) return str;
		if (col === 'blue') return '\x1B[36m'+str+'\x1B[39m';
		if (col === 'gray') return '\x1B[90m'+str+'\x1B[39m';
		return str;
	};
	var visit = function(prev, val) {
		if (val === undefined || val === null) return res.push([prev, '(nil)']);
		if (typeof val !== 'object') return res.push([prev, ''+val]);
		if (Array.isArray(val) && !val.length) return res.push([prev, '(empty)']);

		if (Array.isArray(val)) {
			val.forEach(function(item) {
				visit(prev, item);
			});
			return;
		}

		Object.keys(val).forEach(function(key) {
			visit(prev ? prev+'@'+key : key, val[key]);
		});
	};

	if (typeof obj !== 'object' || !obj || (Array.isArray(obj) && typeof obj[0] !== 'object')) {
		obj = {'$':obj};
	}

	visit('', obj);

	var prev = [];
	var max = res.reduce(function(sofar, line) {
		return line[0].length > sofar.length ? line[0] : sofar;
	}, '').replace(/./g, ' ')+' '+color('gray',':')+' ';

	return res.map(function(line) {
		var prefix = line[0].split('@').map(function(l, i) {
			return l === prev[i] ? l.replace(/./g, ' ') : l;
		}).join('.').replace(/ \. /g, '  ');
		var suffix = max.slice(-(max.length-line[0].length));
		prev = line[0].split('@');
		return color('blue', prefix)+suffix+line[1]+'\n';
	}).join('');
};

module.exports = format;