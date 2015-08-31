var NodeRSA = require('../src/NodeRSA');

var key = new NodeRSA({b:1024}, {environment: 'browser'});
var text = 'Hello RSA!';
var encrypted = key.encrypt(text, 'base64');
var decrypted = key.decrypt(encrypted, 'utf8');
console.log(decrypted);

console.time('browser encrypt');
for(var i = 0; i < 100; i++) {
    var encrypted = key.encrypt(text, 'base64');
    var decrypted = key.decrypt(encrypted, 'utf8');
}
console.timeEnd('browser encrypt');

console.time('browser encrypt (another key)');
for(var i = 0; i < 100; i++) {
    var encrypted = key.encryptPrivate(text, 'base64');
    var decrypted = key.decryptPublic(encrypted, 'utf8');
}
console.timeEnd('browser encrypt (another key)');


var key = new NodeRSA({b:1024}, {encryptionScheme: 'pkcs1'});
var text = 'Hello RSA!';
var encrypted = key.encrypt(text, 'base64');
var decrypted = key.decrypt(encrypted, 'utf8');
console.log(decrypted);

console.time('node encrypt');
for(var i = 0; i < 100; i++) {
    var encrypted = key.encrypt(text, 'base64');
    var decrypted = key.decrypt(encrypted, 'utf8');
}
console.timeEnd('node encrypt');

console.time('node encrypt (another key)');
for(var i = 0; i < 100; i++) {
    var encrypted = key.encryptPrivate(text, 'base64');
    var decrypted = key.decryptPublic(encrypted, 'utf8');
}
console.timeEnd('node encrypt (another key)');