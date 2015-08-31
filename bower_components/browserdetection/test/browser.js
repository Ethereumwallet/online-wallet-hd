casper.getData = function() {
  return this.evaluate(function() {
    return browserDetection();
  });
};

var testCases = [
  // osx - firefox
  {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    expectedBrowser: 'firefox',
    expectedVersion: 24,
    expectedOs: 'osx',
  }, {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/21.0',
    expectedBrowser: 'firefox',
    expectedVersion: 21,
    expectedOs: 'osx',
  }, {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:9.0) Gecko/20100101 Firefox/9.0',
    expectedBrowser: 'firefox',
    expectedVersion: 9,
    expectedOs: 'osx',
  },
  // osx - chrome
  {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36',
    expectedBrowser: 'chrome',
    expectedVersion: 28,
    expectedOs: 'osx',
  }, {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_0) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.79 Safari/537.4',
    expectedBrowser: 'chrome',
    expectedVersion: 22,
    expectedOs: 'osx',
  }, {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.22 (KHTML, like Gecko) Chrome/19.0.1047.0 Safari/535.22',
    expectedBrowser: 'chrome',
    expectedVersion: 19,
    expectedOs: 'osx',
  }, {
    userAgent: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-US) AppleWebKit/533.3 (KHTML, like Gecko) Chrome/5.0.363.0 Safari/533.3',
    expectedBrowser: 'chrome',
    expectedVersion: 5,
    expectedOs: 'osx',
  }, {
    userAgent: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
    expectedBrowser: 'ie',
    expectedVersion: 11,
    expectedOs: 'win',
  }, {
    userAgent: 'invalid',
    expectedBrowser: '', // actually null, but '' because of a phantomjs bug
    expectedVersion: '', // ...
    expectedOs: '', // ...
  },
];

casper.start();
testCases.forEach(function(testCase) {

  casper.then(function() {
    casper.userAgent(testCase.userAgent);
  });
  casper.thenOpen('http://localhost:8888/test/resources/index.html', function() {

    casper.test.comment(testCase.userAgent);

    var data = this.getData();
    this.test.assertEqual(data.browser, testCase.expectedBrowser);
    this.test.assertEqual(data.version, testCase.expectedVersion);
    this.test.assertEqual(data.os, testCase.expectedOs);

  });

});

casper.run();
