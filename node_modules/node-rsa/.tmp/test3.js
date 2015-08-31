var PEM = "-----BEGIN RSA PRIVATE KEY-----\n"+
    "MIICWwIBAAKBgHMnVGetzBjhT0++NtBOf37vKEOvgb8NqIqls54qcwbK840fFQlx\n"+
    "j4KPyrJmZ5jg/UUS4YfcIm1t4iwEn/Swl74d/hF3maJ3wefe60sPGti9K9EogFev\n"+
    "QmETZfM6avGrXFRMgzCNS+il228eZjDnPQ0xip8+V+aRpEYLLiXyKrwdAgMBAAEC\n"+
    "gYA+mBphYS+YNqEOD69r+7+CGC4i3LwCRkJfW0MPrrNn9dn90+9zeq8voUnlP5UA\n"+
    "nQwPB/xgBWERarGOi9UHBRb2Fxi6ckrKatuoFTBptwtKu78dfxsy0ajx2G5MOoNw\n"+
    "hpD83Aajc6/AMvsQoUcBDlrXMKKPpsSWENUgbhcIh6VIAQJBAOLHWHKgrwamQvBK\n"+
    "I9Vz/aV0o4nU6hYg+qWFDckgDZ+LndnfKcnUb+o5ilHGIpIxs4RR3rDX2q0gwrFK\n"+
    "Kl4Ael0CQQCB/drNK5CxKjm1XddRpXabsqCrMoOjn7yJ0TnGCMGYexYhq60e93jx\n"+
    "efhfOcQEeUmctaym4UiesuAO7aaeeKzBAkBICzRaFhoEbsVNOQBxS0wFSCy8GNvU\n"+
    "890swDxE7N3nFZ+sG21XJRn4uxbqK5vH/eod2zR30dsyrPmtAPa8rkIxAkBudVDc\n"+
    "sN1FvlTFSdVymoB780DV2JnFizHBhllqbvxa3pTCzcfRHYbW4sbr3AE1r/6ePD5W\n"+
    "m+6CdAsyhDzmQjLBAkEArM4ATtORWK8ssEZ09HVkVdCUBkrlprlLA/Rlv8QzTV6b\n"+
    "f9l6ChUeum+oXcoVcf1IxGDvsEkXSzxU/hI5L+xMEg==\n"+
    "-----END RSA PRIVATE KEY-----";

var NodeRSA = require('../src/NodeRSA');
var encoder = new NodeRSA(PEM);
var encoder = new NodeRSA(encoder.exportKey('public'));
encoder.encrypt('ddd', "base64", "utf8");