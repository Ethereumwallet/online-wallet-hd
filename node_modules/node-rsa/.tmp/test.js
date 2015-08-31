var NodeRSA = require('../src/NodeRSA');
var key = new NodeRSA({b: 512});

var text = 'Hello RSA!';
var encrypted = key.encrypt(text);
console.log('encrypted: ', encrypted);
var decrypted = key.decrypt(encrypted);
console.log('decrypted: ', decrypted);