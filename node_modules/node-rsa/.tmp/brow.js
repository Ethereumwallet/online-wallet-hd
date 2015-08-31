var NodeRSA = require('../src/NodeRSA');
var crypt = require('crypto');
var PEM = "-----BEGIN RSA PRIVATE KEY-----\n"+
    "MIICXAIBAAKBgQCCdY+EpDC/vPa335l751SBM8d5Lf4z4QZX4bc+DqTY9zVY/rmP\n"+
    "GbTkCueKnIKApuOGMXJOaCwNH9wUftNt7T0foEwjl16uIC8m4hwSjjNL5TKqMVey\n"+
    "Syv04oBuidv76u5yNiLC4J85lbmW3WAyYkTCbm/VJZAXNJuqCm7AVWmQMQIDAQAB\n"+
    "AoGAEYR3oPfrE9PrzQTZNyn4zuCFCGCEobK1h1dno42T1Q5cu3Z4tB5fi79rF9Gs\n"+
    "NFo0cvBwyNZ0E88TXi0pdrlEW6mdPgQFd3CFxrOgKt9AGpOtI1zzVOb1Uddywq/m\n"+
    "WBPyETwEKzq7lC2nAcMUr0rlFrrDmUT2dafHeuWnFMZ/1YECQQDCtftsH9/prbgu\n"+
    "Q4F2lOWsLz96aix/jnI8FhBmukKmfLMXjCZYYv+Dsr8TIl/iriGqcSgGkBHHoGe1\n"+
    "nmLUZ4EHAkEAq4YcB8T9DLIYUeaS+JRWwLOejU6/rYdgxBIaGn2m0Ldp/z7lLM7g\n"+
    "b0H5Al+7POajkAdnDclBDhyxqInHO4VvBwJBAJ25jNEpgNhqQKg5RsYoF2RDYchn\n"+
    "+WPan+7McLzGZPc4TFrmzKkMiK7GPMHjNokJRXwr7aBjVAPBjEEy7BvjPEECQFOJ\n"+
    "4rcKAzEewGeLREObg9Eg6nTqSMLMb52vL1V9ozR+UDrHuDilnXuyhwPX+kqEDl+E\n"+
    "q3V0cqHb6c8rI4TizRsCQANIyhoJ33ughNzbCIknkMPKtgvLOUARnbya/bkfRexL\n"+
    "icyYzXPNuqZDY8JZQHlshN8cCcZcYjGPYYscd2LKB6o=\n"+
    "-----END RSA PRIVATE KEY-----";

while(true) {
    var key = new NodeRSA(PEM, {signingScheme: 'pkcs1-sha1'});
    var enc = key.encrypt('hello');
  //  console.log(enc.toString('base64'));
    var dec = key.decrypt(enc, 'utf8');
  //  console.log(dec);

    var key = new NodeRSA(PEM);
    var enc = key.encryptPrivate('hello');
   // console.log(enc.toString('base64'));
    var dec = key.decryptPublic(enc, 'utf8');
   // console.log(dec);

    var sign = key.sign('hello');
   // console.log(sign.toString('base64'));
    //console.log(key.verify('hello', sign));
    //console.log(key.verify('hello2', sign));

    var key = new NodeRSA({b: 512});
    var text = 'Hello RSA!';
    var encrypted = key.encrypt(text);
    //console.log('encrypted: ', encrypted);
    var decrypted = key.decrypt(encrypted);
    //console.log('decrypted: ', decrypted);
}