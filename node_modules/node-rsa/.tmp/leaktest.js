var NodeRSA = require('../src/NodeRSA');
var assert = require('assert');

var key = new NodeRSA({b: 512});

var text = 'Hello RSA!';
var encrypted = key.encrypt(text);
var decrypted = key.decrypt(encrypted);
assert.equal(decrypted, text);
